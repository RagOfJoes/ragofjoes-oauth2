# Test OAUTH2.0/OIDC implementation for Figure

This is primarity template code for future implementations. It currently only has a MongoDB adapter, however, any DB can be used provided an adapter is created for it. (https://github.com/panva/node-oidc-provider/blob/master/example/my_adapter.js).

## Features

As of(4/16/2020) this only supports login, select_account, and sign_up. Future implementations can include a federated sign_up(https://openid.net/specs/openid-connect-federation-1_0.html), forget password, multi-factor, etc. These other implemetations can vary and is really up to the client how or if they are implemented.

Google's Material Design Javascript library(https://github.com/material-components/material-components-web) is used to "prettify" the whole process but anything can be used in place of this. EJS is also used to render pages but anything can also be used in place of this. Though I would recommend keeping Front-End plugins to a minimum to prevent making this whole process from being anymore complicated.

Also, as an additional security measurement rotating signing keys and following best practices for handling keys and environment variables should also be top of mind if pushing this to production.

## References

Refer to https://github.com/panva/node-oidc-provider/blob/master/docs/README.md for future updates on the underlying oidc implementation

Also refer to https://oauth.net/2/ for any new best practices
