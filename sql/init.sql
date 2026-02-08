--
-- PostgreSQL database dump
--

\restrict EHNT3gX36TWj2FRuUghIi4Tn1J42taeY1qmBDifaNVmp9fDLyqU9r63CoEkPwXG

-- Dumped from database version 17.6 (Debian 17.6-2.pgdg13+1)
-- Dumped by pg_dump version 17.7 (Ubuntu 17.7-3.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: bcoste
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO bcoste;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: bcoste
--

COMMENT ON SCHEMA public IS '';


--
-- Name: enum_move_type; Type: TYPE; Schema: public; Owner: bcoste
--

CREATE TYPE public.enum_move_type AS ENUM (
    'hand_start',
    'foot_start',
    'hand',
    'foot',
    'both',
    'finish'
);


ALTER TYPE public.enum_move_type OWNER TO bcoste;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Gym; Type: TABLE; Schema: public; Owner: bcoste
--

CREATE TABLE public."Gym" (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Gym" OWNER TO bcoste;

--
-- Name: Gym_id_seq; Type: SEQUENCE; Schema: public; Owner: bcoste
--

CREATE SEQUENCE public."Gym_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Gym_id_seq" OWNER TO bcoste;

--
-- Name: Gym_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bcoste
--

ALTER SEQUENCE public."Gym_id_seq" OWNED BY public."Gym".id;


--
-- Name: Photo; Type: TABLE; Schema: public; Owner: bcoste
--

CREATE TABLE public."Photo" (
    id integer NOT NULL,
    file_path character varying(500) NOT NULL,
    file_name character varying(255) NOT NULL,
    mime_type character varying(50) NOT NULL,
    file_size integer NOT NULL,
    uploaded_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Photo" OWNER TO bcoste;

--
-- Name: Photo_id_seq; Type: SEQUENCE; Schema: public; Owner: bcoste
--

CREATE SEQUENCE public."Photo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Photo_id_seq" OWNER TO bcoste;

--
-- Name: Photo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bcoste
--

ALTER SEQUENCE public."Photo_id_seq" OWNED BY public."Photo".id;


--
-- Name: Route; Type: TABLE; Schema: public; Owner: bcoste
--

CREATE TABLE public."Route" (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    grade character varying(10) NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    "gymId" integer
);


ALTER TABLE public."Route" OWNER TO bcoste;

--
-- Name: Route_id_seq; Type: SEQUENCE; Schema: public; Owner: bcoste
--

CREATE SEQUENCE public."Route_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Route_id_seq" OWNER TO bcoste;

--
-- Name: Route_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bcoste
--

ALTER SEQUENCE public."Route_id_seq" OWNED BY public."Route".id;


--
-- Name: Wall; Type: TABLE; Schema: public; Owner: bcoste
--

CREATE TABLE public."Wall" (
    id integer NOT NULL,
    gym_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    photo_id integer NOT NULL
);


ALTER TABLE public."Wall" OWNER TO bcoste;

--
-- Name: Wall_id_seq; Type: SEQUENCE; Schema: public; Owner: bcoste
--

CREATE SEQUENCE public."Wall_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Wall_id_seq" OWNER TO bcoste;

--
-- Name: Wall_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bcoste
--

ALTER SEQUENCE public."Wall_id_seq" OWNED BY public."Wall".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: bcoste
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO bcoste;

--
-- Name: events; Type: TABLE; Schema: public; Owner: bcoste
--

CREATE TABLE public.events (
    id integer NOT NULL,
    day character varying(10) NOT NULL,
    type character varying NOT NULL
);


ALTER TABLE public.events OWNER TO bcoste;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: bcoste
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO bcoste;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bcoste
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: moves; Type: TABLE; Schema: public; Owner: bcoste
--

CREATE TABLE public.moves (
    id integer NOT NULL,
    route_id integer NOT NULL,
    x double precision NOT NULL,
    y double precision NOT NULL,
    type public.enum_move_type NOT NULL,
    radius double precision NOT NULL,
    wall_id integer NOT NULL
);


ALTER TABLE public.moves OWNER TO bcoste;

--
-- Name: moves_id_seq; Type: SEQUENCE; Schema: public; Owner: bcoste
--

CREATE SEQUENCE public.moves_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.moves_id_seq OWNER TO bcoste;

--
-- Name: moves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bcoste
--

ALTER SEQUENCE public.moves_id_seq OWNED BY public.moves.id;


--
-- Name: referents; Type: TABLE; Schema: public; Owner: bcoste
--

CREATE TABLE public.referents (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.referents OWNER TO bcoste;

--
-- Name: referents_id_seq; Type: SEQUENCE; Schema: public; Owner: bcoste
--

CREATE SEQUENCE public.referents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.referents_id_seq OWNER TO bcoste;

--
-- Name: referents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bcoste
--

ALTER SEQUENCE public.referents_id_seq OWNED BY public.referents.id;


--
-- Name: slots; Type: TABLE; Schema: public; Owner: bcoste
--

CREATE TABLE public.slots (
    id integer NOT NULL,
    ref_id integer,
    day character varying(10) NOT NULL,
    start_at time(6) without time zone NOT NULL,
    end_at time(6) without time zone NOT NULL
);


ALTER TABLE public.slots OWNER TO bcoste;

--
-- Name: slots_id_seq; Type: SEQUENCE; Schema: public; Owner: bcoste
--

CREATE SEQUENCE public.slots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.slots_id_seq OWNER TO bcoste;

--
-- Name: slots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bcoste
--

ALTER SEQUENCE public.slots_id_seq OWNED BY public.slots.id;


--
-- Name: Gym id; Type: DEFAULT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public."Gym" ALTER COLUMN id SET DEFAULT nextval('public."Gym_id_seq"'::regclass);


--
-- Name: Photo id; Type: DEFAULT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public."Photo" ALTER COLUMN id SET DEFAULT nextval('public."Photo_id_seq"'::regclass);


--
-- Name: Route id; Type: DEFAULT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public."Route" ALTER COLUMN id SET DEFAULT nextval('public."Route_id_seq"'::regclass);


--
-- Name: Wall id; Type: DEFAULT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public."Wall" ALTER COLUMN id SET DEFAULT nextval('public."Wall_id_seq"'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: moves id; Type: DEFAULT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public.moves ALTER COLUMN id SET DEFAULT nextval('public.moves_id_seq'::regclass);


--
-- Name: referents id; Type: DEFAULT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public.referents ALTER COLUMN id SET DEFAULT nextval('public.referents_id_seq'::regclass);


--
-- Name: slots id; Type: DEFAULT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public.slots ALTER COLUMN id SET DEFAULT nextval('public.slots_id_seq'::regclass);


--
-- Data for Name: Gym; Type: TABLE DATA; Schema: public; Owner: bcoste
--

COPY public."Gym" (id, name, description, created_at, updated_at) FROM stdin;
0	Gym A	\N	2026-02-08 12:53:48.798	2026-02-08 12:53:48.798
1	Gym B	\N	2026-02-08 12:53:48.798	2026-02-08 12:53:48.798
\.


--
-- Data for Name: Photo; Type: TABLE DATA; Schema: public; Owner: bcoste
--

COPY public."Photo" (id, file_path, file_name, mime_type, file_size, uploaded_at) FROM stdin;
0	walls/sample.jpeg	sample.jpeg	image/jpeg	123456	2026-02-08 12:53:48.801
1	walls/sample2.jpeg	sample2.jpeg	image/jpeg	123456	2026-02-08 12:53:48.801
\.


--
-- Data for Name: Route; Type: TABLE DATA; Schema: public; Owner: bcoste
--

COPY public."Route" (id, name, grade, description, created_at, updated_at, "gymId") FROM stdin;
1	Route 1	5a	\N	2026-02-08 12:53:48.805	2026-02-08 12:53:48.805	0
\.


--
-- Data for Name: Wall; Type: TABLE DATA; Schema: public; Owner: bcoste
--

COPY public."Wall" (id, gym_id, name, description, created_at, updated_at, photo_id) FROM stdin;
0	0	Mur 1	\N	2026-02-01 10:47:45.371	2026-02-01 10:47:45.371	0
1	0	Mur 2	\N	2026-02-02 10:47:45.381	2026-02-02 10:47:45.381	1
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: bcoste
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3a027500-87a2-45b7-91a8-3468c03b96ca	d889dd9c3eaeaebc7a0d56956c86c8e414a4a47ba6b32d1e07895aa739236110	2026-02-08 12:53:47.413286+00	0_init	\N	\N	2026-02-08 12:53:47.410376+00	1
aacb8da0-a305-4636-a364-927a77b06be2	119c0dfc8d65d91ab505cedda4ef312e67f3f38a4712182c7331998bcabfaf18	2026-02-08 12:53:47.416246+00	20251111225852_walls	\N	\N	2026-02-08 12:53:47.413444+00	1
a4829182-b6a1-4f84-91de-02785617256f	902e71fabdf00eec5575e1929e0308147cbd7075f1df5b9b1f2ff04654ca3e65	2026-02-08 12:53:47.420289+00	20251111231218_camel	\N	\N	2026-02-08 12:53:47.416402+00	1
4e4c3e77-7b2b-47e0-8c55-cb7498401d88	6d54113df50ef981922bfcfe2bf076e1f0e1069326cbaeac785689423221936b	2026-02-08 12:53:47.422481+00	20251111235107_photo	\N	\N	2026-02-08 12:53:47.420435+00	1
45cd3df5-5cbd-460d-b01d-72030996eb9c	73fa5f252c12dc303b77fbb25cc24c9a25eb5d9987eefa1dc040e7a0cee95c29	2026-02-08 12:53:47.424008+00	20251112001542_walloptionaal	\N	\N	2026-02-08 12:53:47.422639+00	1
dcc4a487-c289-4a4e-9b11-a91083dbe127	323cf8bc438e909846706b2c83a04f493b7e100dc6ef44f30527b488916337b7	2026-02-08 12:53:47.425473+00	20251112003915_routes	\N	\N	2026-02-08 12:53:47.424203+00	1
85a25acb-1100-4669-b170-1e0977f372e5	e039575ab9b5c640d239e5de43bd8fbd56d71fbd47b9018f706f5cd3b1f14d34	2026-02-08 12:53:47.426606+00	20251112004221_routes	\N	\N	2026-02-08 12:53:47.425667+00	1
9cb9116b-890a-48d9-9d8a-dd77d5d111c8	2dd17832f576c78512270137479e0aeb58487c7478cbcba207566118f34236f2	2026-02-08 12:53:47.427431+00	20251113002411_jjson	\N	\N	2026-02-08 12:53:47.42678+00	1
c6540008-d878-4013-a784-b89438dfea23	7e60a62e9498950179d23ad80e446586d60b7c8b271231c7dee338f21734b8f2	2026-02-08 12:53:47.42962+00	20260202120901_moves	\N	\N	2026-02-08 12:53:47.427626+00	1
68291d17-e676-4f4c-b5c1-c71c0008760f	08d5b3d175f51daa9e78cc018aabe3870599ec00b597d6a872958b7cc34cae4b	2026-02-08 12:53:47.43031+00	20260203095801_deprecated_move_body	\N	\N	2026-02-08 12:53:47.429829+00	1
8fe92766-173d-4bc1-b310-67334817bd71	5d55b9a4c267da99dd564ec40e71523dde7606f33ed2ed2a8b45e7c4c021955a	2026-02-08 12:53:47.431013+00	20260205182625_remove_body	\N	\N	2026-02-08 12:53:47.43051+00	1
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: bcoste
--

COPY public.events (id, day, type) FROM stdin;
\.


--
-- Data for Name: moves; Type: TABLE DATA; Schema: public; Owner: bcoste
--

COPY public.moves (id, route_id, x, y, type, radius, wall_id) FROM stdin;
\.


--
-- Data for Name: referents; Type: TABLE DATA; Schema: public; Owner: bcoste
--

COPY public.referents (id, name) FROM stdin;
0	referent1
1	referent2
2	referent3
3	referent4
4	referent5
5	referent6
6	referent7
7	referent8
8	referent9
9	referent10
10	referent11
11	referent12
12	referent13
13	referent14
14	referent15
15	referent16
16	referent17
17	referent18
18	referent19
19	referent20
20	referent21
21	referent22
22	referent23
23	referent24
24	referent25
25	referent26
26	referent27
27	referent28
28	referent29
29	referent30
\.


--
-- Data for Name: slots; Type: TABLE DATA; Schema: public; Owner: bcoste
--

COPY public.slots (id, ref_id, day, start_at, end_at) FROM stdin;
\.


--
-- Name: Gym_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bcoste
--

SELECT pg_catalog.setval('public."Gym_id_seq"', 1, false);


--
-- Name: Photo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bcoste
--

SELECT pg_catalog.setval('public."Photo_id_seq"', 1, false);


--
-- Name: Route_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bcoste
--

SELECT pg_catalog.setval('public."Route_id_seq"', 1, true);


--
-- Name: Wall_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bcoste
--

SELECT pg_catalog.setval('public."Wall_id_seq"', 1, false);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bcoste
--

SELECT pg_catalog.setval('public.events_id_seq', 1, false);


--
-- Name: moves_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bcoste
--

SELECT pg_catalog.setval('public.moves_id_seq', 1, false);


--
-- Name: referents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bcoste
--

SELECT pg_catalog.setval('public.referents_id_seq', 1, false);


--
-- Name: slots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bcoste
--

SELECT pg_catalog.setval('public.slots_id_seq', 1, false);


--
-- Name: Gym Gym_pkey; Type: CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public."Gym"
    ADD CONSTRAINT "Gym_pkey" PRIMARY KEY (id);


--
-- Name: Photo Photo_pkey; Type: CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public."Photo"
    ADD CONSTRAINT "Photo_pkey" PRIMARY KEY (id);


--
-- Name: Route Route_pkey; Type: CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public."Route"
    ADD CONSTRAINT "Route_pkey" PRIMARY KEY (id);


--
-- Name: Wall Wall_pkey; Type: CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public."Wall"
    ADD CONSTRAINT "Wall_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: moves moves_pkey; Type: CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT moves_pkey PRIMARY KEY (id);


--
-- Name: referents referents_pkey; Type: CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public.referents
    ADD CONSTRAINT referents_pkey PRIMARY KEY (id);


--
-- Name: slots slots_pkey; Type: CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public.slots
    ADD CONSTRAINT slots_pkey PRIMARY KEY (id);


--
-- Name: Wall_photo_id_key; Type: INDEX; Schema: public; Owner: bcoste
--

CREATE UNIQUE INDEX "Wall_photo_id_key" ON public."Wall" USING btree (photo_id);


--
-- Name: events_day_key; Type: INDEX; Schema: public; Owner: bcoste
--

CREATE UNIQUE INDEX events_day_key ON public.events USING btree (day);


--
-- Name: referents_name_key; Type: INDEX; Schema: public; Owner: bcoste
--

CREATE UNIQUE INDEX referents_name_key ON public.referents USING btree (name);


--
-- Name: Route Route_gymId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public."Route"
    ADD CONSTRAINT "Route_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES public."Gym"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Wall Wall_gym_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public."Wall"
    ADD CONSTRAINT "Wall_gym_id_fkey" FOREIGN KEY (gym_id) REFERENCES public."Gym"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Wall Wall_photo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public."Wall"
    ADD CONSTRAINT "Wall_photo_id_fkey" FOREIGN KEY (photo_id) REFERENCES public."Photo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: moves moves_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT moves_route_id_fkey FOREIGN KEY (route_id) REFERENCES public."Route"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: moves moves_wall_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT moves_wall_id_fkey FOREIGN KEY (wall_id) REFERENCES public."Wall"(id);


--
-- Name: slots slots_ref_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bcoste
--

ALTER TABLE ONLY public.slots
    ADD CONSTRAINT slots_ref_id_fkey FOREIGN KEY (ref_id) REFERENCES public.referents(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: bcoste
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict EHNT3gX36TWj2FRuUghIi4Tn1J42taeY1qmBDifaNVmp9fDLyqU9r63CoEkPwXG

