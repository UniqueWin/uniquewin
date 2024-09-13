create table
  public.games (
    id uuid not null default gen_random_uuid (),
    question text not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    valid_answers text[] not null,
    price integer not null default 1,
    status text null default 'pending'::text,
    current_prize numeric(10, 2) null default 0,
    lucky_dip_price numeric(10, 2) null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint games_pkey primary key (id)
  ) tablespace pg_default;

  create table
  public.instant_win_prizes (
    id uuid not null default gen_random_uuid (),
    prize_amount numeric(10, 2) not null,
    probability numeric(5, 4) not null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    prize_type text not null,
    prize_details jsonb null,
    constraint instant_win_prizes_pkey primary key (id)
  ) tablespace pg_default;

  create table
  public.game_instant_win_prizes (
    id uuid not null default gen_random_uuid (),
    game_id uuid null,
    instant_win_prize_id uuid null,
    quantity integer not null,
    custom_probability numeric(5, 4) not null,
    constraint game_instant_win_prizes_pkey primary key (id),
    constraint game_instant_win_prizes_game_id_instant_win_prize_id_key unique (game_id, instant_win_prize_id),
    constraint game_instant_win_prizes_game_id_fkey foreign key (game_id) references games (id) on delete cascade,
    constraint game_instant_win_prizes_instant_win_prize_id_fkey foreign key (instant_win_prize_id) references instant_win_prizes (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.answers (
    id uuid not null default gen_random_uuid (),
    game_id uuid null,
    user_id uuid null,
    answer_text text not null,
    status text null default 'pending'::text,
    is_instant_win boolean null default false,
    is_lucky_dip boolean null default false,
    instant_win_amount numeric(10, 2) null default 0,
    submitted_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint answers_pkey primary key (id),
    constraint answers_game_id_fkey foreign key (game_id) references games (id) on delete cascade,
    constraint answers_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;

create index if not exists idx_answers_game_id on public.answers using btree (game_id) tablespace pg_default;

create index if not exists idx_answers_user_id on public.answers using btree (user_id) tablespace pg_default;