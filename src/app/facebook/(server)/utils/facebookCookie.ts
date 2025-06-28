export function facebookCookies(): any[] {
    const userId = process.env.USER_ID;
    const facebookCookie = process.env.FACEBOOK_COOKIE;
    if (!userId || !facebookCookie) {
      throw new Error('USER_ID or FACEBOOK_COOKIE is not defined in the environment');
    }
    return [
      {
        name: 'c_user',
        value: userId,
        domain: '.facebook.com',
        path: '/',
        httpOnly: true,
        secure: true,
      },
      {
        name: 'xs',
        value: facebookCookie,
        domain: '.facebook.com',
        path: '/',
        httpOnly: true,
        secure: true,
      },
    ];
  }