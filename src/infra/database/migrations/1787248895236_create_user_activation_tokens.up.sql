CREATE TABLE user_activation_tokens (
  id CHAR(26) PRIMARY KEY,
  user_fk CHAR(26) NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  consumed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  token_hash CHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX user_activation_tokens_token_hash_key ON user_activation_tokens (token_hash);

CREATE INDEX user_activation_tokens_user_fk_idx ON user_activation_tokens (user_fk);
