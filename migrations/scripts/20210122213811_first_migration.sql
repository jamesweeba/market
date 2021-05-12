--
--    Copyright 2010-2016 the original author or authors.
--
--    Licensed under the Apache License, Version 2.0 (the "License");
--    you may not use this file except in compliance with the License.
--    You may obtain a copy of the License at
--
--       http://www.apache.org/licenses/LICENSE-2.0
--
--    Unless required by applicable law or agreed to in writing, software
--    distributed under the License is distributed on an "AS IS" BASIS,
--    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
--    See the License for the specific language governing permissions and
--    limitations under the License.
--

-- // First migration.
-- Migration SQL that makes the change goes here.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
user_id uuid  PRIMARY KEY  DEFAULT uuid_generate_v4 (),
first_name varchar not null,
last_name varchar not null,
contact varchar not null,
email varchar not null,
password varchar not null,
role varchar not null default 'manager',
posted_ts timestamptz default now()
)


-- //@UNDO
-- SQL to undo the change goes here.

DROP TABLE users;
