-- Up Migration

CREATE TABLE user_activation_tokens (
  id CHAR(26) NOT NULL,
  user_id_fk CHAR(26) NOT NULL,
  token CHAR(32) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT user_activation_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT user_activation_tokens_token_unique UNIQUE (token),
  CONSTRAINT user_activation_tokens_user_id_fk_fkey FOREIGN KEY (user_id_fk) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX user_activation_tokens_user_id_fk_idx ON user_activation_tokens (user_id_fk);

-- Down Migration

DROP TABLE user_activation_tokens;
