import jsonwebtoken from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('auth');

const jwksUrl = 'https://dev-fln3db20.us.auth0.com/.well-known/jwks.json';

const client = jwksClient({
  jwksUri: jwksUrl,
});

export async function handler(event) {
  try {
    const payload = await verifyToken(event.authorizationToken);
    logger.info('user is authenticated');

    return {
      principalId: payload.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      context: { user: JSON.stringify({ ...payload }) },
    };
  } catch (e) {
    logger.error('User not authorized', { error: e.message });

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    };
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader);
  const jwt = jsonwebtoken.decode(token, { complete: true });
  const header = jwt.header;
  const key = await getKey(header);
  const payload = jsonwebtoken.verify(token, key);
  return payload;
}

function getKey(header) {
  return new Promise((resolve, reject) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        reject(err);
      } else {
        const signingKey = key.getPublicKey();
        resolve(signingKey);
      }
    });
  });
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header');

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header');

  const split = authHeader.split(' ');
  const token = split[1];

  return token;
}
