--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2024-12-27 03:58:14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 236 (class 1255 OID 41027)
-- Name: log_candidate_action(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_candidate_action() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Генерируем значение для столбца action
  INSERT INTO action_log (user_id, action, created_at)
  VALUES (
    -- Если user_id недоступен, можно оставить NULL или указать системного пользователя
    NULL,
    -- Генерация текста для столбца action
    CASE
      WHEN TG_OP = 'INSERT' THEN
        'Added candidate: ' || COALESCE(NEW.name, 'Unknown name') || 
        COALESCE(' to job ID ' || NEW.job_id, '')
      WHEN TG_OP = 'UPDATE' THEN
        'Updated candidate: ' || COALESCE(NEW.name, OLD.name, 'Unknown name')
      WHEN TG_OP = 'DELETE' THEN
        'Deleted candidate: ' || COALESCE(OLD.name, 'Unknown name') || 
        COALESCE(' from job ID ' || OLD.job_id, '')
      ELSE
        'Undefined operation on candidate'
    END,
    CURRENT_TIMESTAMP
  );

  RETURN NULL;
END;
$$;


ALTER FUNCTION public.log_candidate_action() OWNER TO postgres;

--
-- TOC entry 235 (class 1255 OID 41025)
-- Name: log_job_action(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_job_action() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO action_log (user_id, action, created_at)
  VALUES (
    NULL, -- Так как recruiter_id отсутствует, используем NULL
    CASE
      WHEN TG_OP = 'INSERT' THEN 'Created job: ' || NEW.title
      WHEN TG_OP = 'UPDATE' THEN 'Updated job: ' || COALESCE(NEW.title, OLD.title)
      WHEN TG_OP = 'DELETE' THEN 'Deleted job: ' || OLD.title
      ELSE 'Unknown operation on job'
    END,
    CURRENT_TIMESTAMP
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION public.log_job_action() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 32799)
-- Name: action_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.action_log (
    id integer NOT NULL,
    user_id integer,
    action character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.action_log OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 32798)
-- Name: action_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.action_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.action_log_id_seq OWNER TO postgres;

--
-- TOC entry 4901 (class 0 OID 0)
-- Dependencies: 227
-- Name: action_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.action_log_id_seq OWNED BY public.action_log.id;


--
-- TOC entry 230 (class 1259 OID 32814)
-- Name: candidate_comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidate_comment (
    id integer NOT NULL,
    candidate_id integer,
    recruiter_id integer,
    comment text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.candidate_comment OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 32813)
-- Name: candidate_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidate_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidate_comment_id_seq OWNER TO postgres;

--
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 229
-- Name: candidate_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidate_comment_id_seq OWNED BY public.candidate_comment.id;


--
-- TOC entry 226 (class 1259 OID 24633)
-- Name: candidate_stage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidate_stage (
    id integer NOT NULL,
    candidate_id integer,
    stage_id integer,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.candidate_stage OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24632)
-- Name: candidate_stage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidate_stage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidate_stage_id_seq OWNER TO postgres;

--
-- TOC entry 4903 (class 0 OID 0)
-- Dependencies: 225
-- Name: candidate_stage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidate_stage_id_seq OWNED BY public.candidate_stage.id;


--
-- TOC entry 222 (class 1259 OID 24607)
-- Name: candidates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidates (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    resume text,
    job_id integer
);


ALTER TABLE public.candidates OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24606)
-- Name: candidates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidates_id_seq OWNER TO postgres;

--
-- TOC entry 4904 (class 0 OID 0)
-- Dependencies: 221
-- Name: candidates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidates_id_seq OWNED BY public.candidates.id;


--
-- TOC entry 218 (class 1259 OID 16435)
-- Name: job_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_type (
    id integer NOT NULL,
    type_name character varying(50) NOT NULL
);


ALTER TABLE public.job_type OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16434)
-- Name: job_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_type_id_seq OWNER TO postgres;

--
-- TOC entry 4905 (class 0 OID 0)
-- Dependencies: 217
-- Name: job_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_type_id_seq OWNED BY public.job_type.id;


--
-- TOC entry 220 (class 1259 OID 16442)
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    job_type_id integer,
    status character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    closed_at timestamp without time zone
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16441)
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO postgres;

--
-- TOC entry 4906 (class 0 OID 0)
-- Dependencies: 219
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- TOC entry 234 (class 1259 OID 41046)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 41045)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 4907 (class 0 OID 0)
-- Dependencies: 233
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 232 (class 1259 OID 32834)
-- Name: report; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report (
    id integer NOT NULL,
    user_id integer,
    job_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    content text NOT NULL
);


ALTER TABLE public.report OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 32833)
-- Name: report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.report_id_seq OWNER TO postgres;

--
-- TOC entry 4908 (class 0 OID 0)
-- Dependencies: 231
-- Name: report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.report_id_seq OWNED BY public.report.id;


--
-- TOC entry 224 (class 1259 OID 24621)
-- Name: stages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stages (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    job_id integer
);


ALTER TABLE public.stages OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24620)
-- Name: stages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stages_id_seq OWNER TO postgres;

--
-- TOC entry 4909 (class 0 OID 0)
-- Dependencies: 223
-- Name: stages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stages_id_seq OWNED BY public.stages.id;


--
-- TOC entry 216 (class 1259 OID 16416)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16415)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4910 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4689 (class 2604 OID 32802)
-- Name: action_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_log ALTER COLUMN id SET DEFAULT nextval('public.action_log_id_seq'::regclass);


--
-- TOC entry 4691 (class 2604 OID 32817)
-- Name: candidate_comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_comment ALTER COLUMN id SET DEFAULT nextval('public.candidate_comment_id_seq'::regclass);


--
-- TOC entry 4687 (class 2604 OID 24636)
-- Name: candidate_stage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_stage ALTER COLUMN id SET DEFAULT nextval('public.candidate_stage_id_seq'::regclass);


--
-- TOC entry 4685 (class 2604 OID 24610)
-- Name: candidates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates ALTER COLUMN id SET DEFAULT nextval('public.candidates_id_seq'::regclass);


--
-- TOC entry 4682 (class 2604 OID 16438)
-- Name: job_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_type ALTER COLUMN id SET DEFAULT nextval('public.job_type_id_seq'::regclass);


--
-- TOC entry 4683 (class 2604 OID 16445)
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- TOC entry 4695 (class 2604 OID 41049)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 4693 (class 2604 OID 32837)
-- Name: report id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report ALTER COLUMN id SET DEFAULT nextval('public.report_id_seq'::regclass);


--
-- TOC entry 4686 (class 2604 OID 24624)
-- Name: stages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stages ALTER COLUMN id SET DEFAULT nextval('public.stages_id_seq'::regclass);


--
-- TOC entry 4681 (class 2604 OID 16419)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4889 (class 0 OID 32799)
-- Dependencies: 228
-- Data for Name: action_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.action_log (id, user_id, action, created_at) FROM stdin;
1	2	Created job: Action Log test	2024-12-21 15:06:24.660591
2	2	Created job: CreateTest	2024-12-21 20:15:54.618665
3	2	Created job: CreatTestNoType	2024-12-21 20:16:32.565894
4	2	Created job: NewJob	2024-12-22 23:05:36.668094
5	\N	Created job: AdminJob	2024-12-23 00:26:03.428746
6	\N	Added candidate: TestLogsAdmin to job ID 25	2024-12-23 00:27:27.57176
7	\N	Created job: DLebetskyJob	2024-12-23 00:28:33.968618
8	\N	Added candidate: DLebetskyCandidate to job ID 26	2024-12-23 00:28:49.147857
9	\N	Updated job: DLebetskyJob	2024-12-23 00:40:06.082769
10	\N	Created job: NotificationJob	2024-12-23 01:12:54.229465
11	\N	Created job: NotificationTest	2024-12-23 01:13:18.803032
12	\N	Created job: NotificationJob	2024-12-23 01:15:18.345876
13	\N	Created job: AdminJob	2024-12-23 01:18:50.257525
14	\N	Updated job: AdminJob	2024-12-23 01:39:19.541726
15	\N	Added candidate: twd to job ID 30	2024-12-23 01:44:20.285378
16	\N	Created job: NewJob342	2024-12-24 17:14:13.917444
17	\N	Created job: Wdwdqqwd	2024-12-24 17:23:55.909225
18	\N	Created job: fewefwef	2024-12-24 17:24:50.166548
19	\N	Updated job: fewefwef	2024-12-24 17:25:32.787485
20	\N	Created job: Lalala	2024-12-27 00:02:00.171655
21	\N	Deleted job: Lalala	2024-12-27 00:02:00.228759
23	\N	Created job: Lalala	2024-12-27 00:08:17.331842
24	\N	Deleted job: Lalala	2024-12-27 00:08:17.369442
26	\N	Created job: Lalala	2024-12-27 00:42:02.086863
27	\N	Deleted job: Lalala	2024-12-27 00:42:02.138685
28	\N	Added candidate: lalala	2024-12-27 00:42:02.153571
29	\N	Created job: Lalala	2024-12-27 00:47:51.680801
30	\N	Deleted job: Lalala	2024-12-27 00:47:51.725949
31	\N	Added candidate: lalala	2024-12-27 00:47:51.744247
32	\N	Deleted candidate: lalala	2024-12-27 00:47:51.764471
33	\N	Created job: Lalala	2024-12-27 00:50:16.964091
34	\N	Updated job: Senior Software Developer	2024-12-27 00:50:16.99872
35	\N	Deleted job: Senior Software Developer	2024-12-27 00:50:17.006388
36	\N	Added candidate: lalala	2024-12-27 00:50:17.016172
37	\N	Deleted candidate: lalala	2024-12-27 00:50:17.037194
38	\N	Updated job: test jest	2024-12-27 00:56:27.626548
39	\N	Created job: Lalala	2024-12-27 00:59:14.88883
40	\N	Updated job: Senior Software Developer	2024-12-27 00:59:14.914928
41	\N	Deleted job: Senior Software Developer	2024-12-27 00:59:14.923115
42	\N	Added candidate: lalala	2024-12-27 00:59:14.935532
43	\N	Deleted candidate: lalala	2024-12-27 00:59:14.946181
44	\N	Created job: Lalala	2024-12-27 01:00:03.145332
45	\N	Updated job: Senior Software Developer	2024-12-27 01:00:03.171417
46	\N	Deleted job: Senior Software Developer	2024-12-27 01:00:03.181119
47	\N	Added candidate: lalala	2024-12-27 01:00:03.194578
48	\N	Deleted candidate: lalala	2024-12-27 01:00:03.207131
49	\N	Created job: Lalala	2024-12-27 01:45:47.249308
50	\N	Updated job: Senior Software Developer	2024-12-27 01:45:47.291128
51	\N	Deleted job: Senior Software Developer	2024-12-27 01:45:47.302622
52	\N	Added candidate: lalala	2024-12-27 01:45:47.31597
53	\N	Deleted candidate: lalala	2024-12-27 01:45:47.331907
\.


--
-- TOC entry 4891 (class 0 OID 32814)
-- Dependencies: 230
-- Data for Name: candidate_comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidate_comment (id, candidate_id, recruiter_id, comment, created_at) FROM stdin;
1	3	2	Great candidate with strong technical skills.	2024-12-21 15:53:54.994233
2	3	2	Great цйаацй.	2024-12-21 15:54:00.659158
3	16	2	Hey2024	2024-12-22 23:00:27.11949
5	23	2	kokokokok	2024-12-22 23:06:03.197517
6	27	\N	DLebetskyComment	2024-12-23 00:28:54.47431
\.


--
-- TOC entry 4887 (class 0 OID 24633)
-- Dependencies: 226
-- Data for Name: candidate_stage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidate_stage (id, candidate_id, stage_id, updated_at) FROM stdin;
30	4	7	2024-12-22 21:25:49.648305
31	3	7	2024-12-22 21:25:49.649358
32	3	7	2024-12-22 21:25:49.650024
33	4	7	2024-12-22 21:25:49.650557
34	3	7	2024-12-22 21:25:49.651055
35	\N	7	2024-12-22 21:25:49.651447
36	10	7	2024-12-22 21:25:49.652098
37	\N	7	2024-12-22 21:25:49.652518
38	14	7	2024-12-22 21:25:49.652972
39	3	7	2024-12-22 21:31:40.03318
40	4	7	2024-12-22 21:31:40.036132
41	3	7	2024-12-22 21:31:40.036838
42	3	7	2024-12-22 21:31:40.037366
43	8	7	2024-12-22 21:31:40.037865
44	9	7	2024-12-22 21:31:40.038346
45	10	7	2024-12-22 21:31:40.038708
46	11	7	2024-12-22 21:31:40.039164
47	12	7	2024-12-22 21:31:40.039615
48	13	7	2024-12-22 21:31:40.040224
49	14	7	2024-12-22 21:31:40.041029
52	3	7	2024-12-22 21:52:12.086771
53	4	7	2024-12-22 21:52:12.087687
56	3	7	2024-12-22 21:52:37.748373
57	4	7	2024-12-22 21:52:37.749571
60	3	7	2024-12-22 21:58:09.131827
61	4	7	2024-12-22 21:58:09.133139
64	17	12	2024-12-22 22:05:30.209106
73	3	7	2024-12-22 22:25:19.979697
74	4	7	2024-12-22 22:25:19.980316
75	20	7	2024-12-22 22:25:35.666984
77	21	18	2024-12-22 22:26:25.196855
79	21	18	2024-12-22 22:26:31.861917
83	3	7	2024-12-22 23:04:13.097819
84	23	23	2024-12-22 23:05:55.613462
85	24	23	2024-12-22 23:27:55.555116
88	26	26	2024-12-23 00:27:27.581193
89	27	27	2024-12-23 00:28:49.155116
90	28	28	2024-12-23 01:44:20.306251
91	28	29	2024-12-24 17:13:54.440202
92	21	31	2024-12-24 17:24:17.240547
93	31	35	2024-12-27 00:42:02.154319
\.


--
-- TOC entry 4883 (class 0 OID 24607)
-- Dependencies: 222
-- Data for Name: candidates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidates (id, name, email, resume, job_id) FROM stdin;
3	John Doe	johndoe@example.com	Experienced developer looking for opportunities.	1
4	CandidateVacancy	dwq@gmail.com	Wow	1
6	Hey	qdwq@gmail.com	dewoijdw	21
7	AddOnInterview	AddOnInterview@gmail.com	AddOnInterview	1
8	AddToInterviewStage	AddToInterviewStage@gmail.com	AddToInterviewStage	1
9	Lol	Lol@gmail.com	wdqqdw	1
10	Test2	test@gmail.com	Cool resume	1
11	New	new@gmail.com	new resume	1
12	Consulting	consulting@gmail.com	wqdqdw	1
13	TestBackend	TestBackend@gmail.com	Hohoho	1
14	Jane Smith	janesmith@example.com	Marketing specialist with a proven track record in social media campaigns	1
16	TestAdd	wd@gmail.com	wqd	21
17	Bob	Ross@gmail.com	Resumeheeey	20
20	TestNew	structure@gmail.com	Changed smth	1
21	Try	hoho@gmail.com	New year	17
23	Yesss	wq@gmail.com	Tototo	22
24	ЙЦ	try@gmail.com	qwdqwd	22
26	TestLogsAdmin	gqwd@gmail.com	5 years	25
27	DLebetskyCandidate	qw@gmail.com	wdwq	26
28	twd	qwd@gmail.com	wwdqdwq	30
31	lalala	lalala@example.com	link_to_resume	\N
\.


--
-- TOC entry 4879 (class 0 OID 16435)
-- Dependencies: 218
-- Data for Name: job_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_type (id, type_name) FROM stdin;
3	Manager
4	QA Junior
6	Developer
\.


--
-- TOC entry 4881 (class 0 OID 16442)
-- Dependencies: 220
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (id, title, description, job_type_id, status, created_at, closed_at) FROM stdin;
1	Updated Job Title	Updated job description.	\N	closed	2024-11-07 21:01:43.785399	2024-12-21 14:36:39.54
17	PHP DEV	Test action log.	3	open	2024-12-21 15:03:31.121092	\N
18	Trye	wqdwdwqd.	\N	open	2024-12-21 15:05:13.63358	\N
19	Action Log test	Now it's gonna work.	\N	open	2024-12-21 15:06:24.653882	\N
20	CreateTest	CreateTest	\N	open	2024-12-21 20:15:54.605935	\N
22	NewJob	efwfe	6	closed	2024-12-22 23:05:36.665508	2024-12-22 23:27:43.78
21	CreatTestNoType	CreatTestNoType	\N	closed	2024-12-21 20:16:32.564146	2024-12-22 23:52:05.076
25	AdminJob	Created by admin	6	open	2024-12-23 00:26:03.428746	\N
26	DLebetskyJob	DLebetskyDescription	4	closed	2024-12-23 00:28:33.968618	2024-12-23 00:40:06.082
27	NotificationJob	eqwd	3	open	2024-12-23 01:12:54.229465	\N
28	NotificationTest	wqdwdq	3	open	2024-12-23 01:13:18.803032	\N
29	NotificationJob	wdqwdwq	4	open	2024-12-23 01:15:18.345876	\N
30	AdminJob	dwqwdq	\N	closed	2024-12-23 01:18:50.257525	2024-12-23 01:39:19.541
31	NewJob342	efwef	3	open	2024-12-24 17:14:13.917444	\N
32	Wdwdqqwd	efwfew	3	open	2024-12-24 17:23:55.909225	\N
33	test jest	cmsmks	4	closed	2024-12-24 17:24:50.166548	2024-12-24 17:25:32.781
\.


--
-- TOC entry 4895 (class 0 OID 41046)
-- Dependencies: 234
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, message, is_read, created_at) FROM stdin;
1	2	New job created: NotificationJob	t	2024-12-23 01:15:18.353547
2	2	New job created: AdminJob	t	2024-12-23 01:18:50.269737
3	4	New job created: AdminJob	t	2024-12-23 01:18:50.270953
4	2	New job created: NewJob342	f	2024-12-24 17:14:13.932845
5	4	New job created: NewJob342	f	2024-12-24 17:14:13.934144
6	7	New job created: NewJob342	t	2024-12-24 17:14:13.934544
7	2	New job created: Wdwdqqwd	f	2024-12-24 17:23:55.935195
8	4	New job created: Wdwdqqwd	f	2024-12-24 17:23:55.938633
10	2	New job created: fewefwef	f	2024-12-24 17:24:50.183625
11	4	New job created: fewefwef	f	2024-12-24 17:24:50.186771
12	7	New job created: fewefwef	f	2024-12-24 17:24:50.188215
9	7	New job created: Wdwdqqwd	t	2024-12-24 17:23:55.940192
13	2	New job created: Lalala	f	2024-12-27 00:02:00.190972
14	4	New job created: Lalala	f	2024-12-27 00:02:00.193735
15	7	New job created: Lalala	f	2024-12-27 00:02:00.194396
16	8	New job created: Lalala	f	2024-12-27 00:02:00.194912
17	2	New job created: Lalala	f	2024-12-27 00:08:17.337161
18	4	New job created: Lalala	f	2024-12-27 00:08:17.337971
19	7	New job created: Lalala	f	2024-12-27 00:08:17.338611
20	8	New job created: Lalala	f	2024-12-27 00:08:17.339154
21	2	New job created: Lalala	f	2024-12-27 00:42:02.092896
22	4	New job created: Lalala	f	2024-12-27 00:42:02.094014
23	7	New job created: Lalala	f	2024-12-27 00:42:02.095597
24	8	New job created: Lalala	f	2024-12-27 00:42:02.096698
25	2	New job created: Lalala	f	2024-12-27 00:47:51.687283
26	4	New job created: Lalala	f	2024-12-27 00:47:51.688175
27	7	New job created: Lalala	f	2024-12-27 00:47:51.688668
28	8	New job created: Lalala	f	2024-12-27 00:47:51.689262
29	2	New job created: Lalala	f	2024-12-27 00:50:16.968118
30	4	New job created: Lalala	f	2024-12-27 00:50:16.969621
31	7	New job created: Lalala	f	2024-12-27 00:50:16.970536
32	8	New job created: Lalala	f	2024-12-27 00:50:16.971329
33	2	New job created: Lalala	f	2024-12-27 00:59:14.895159
34	4	New job created: Lalala	f	2024-12-27 00:59:14.896037
35	7	New job created: Lalala	f	2024-12-27 00:59:14.896521
36	8	New job created: Lalala	f	2024-12-27 00:59:14.89707
37	2	New job created: Lalala	f	2024-12-27 01:00:03.149597
38	4	New job created: Lalala	f	2024-12-27 01:00:03.150557
39	7	New job created: Lalala	f	2024-12-27 01:00:03.151413
40	8	New job created: Lalala	f	2024-12-27 01:00:03.152151
41	2	New job created: Lalala	f	2024-12-27 01:45:47.257601
42	4	New job created: Lalala	f	2024-12-27 01:45:47.259817
43	7	New job created: Lalala	f	2024-12-27 01:45:47.260984
44	8	New job created: Lalala	f	2024-12-27 01:45:47.26177
\.


--
-- TOC entry 4893 (class 0 OID 32834)
-- Dependencies: 232
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.report (id, user_id, job_id, created_at, content) FROM stdin;
1	2	1	2024-12-21 15:56:36.270041	The job has 10 candidates and is progressing well.
2	2	25	2024-12-23 00:46:19.727372	Closed in 2 weeks
3	4	1	2024-12-23 00:46:55.458984	ADMIN REPORT
4	4	30	2024-12-23 01:21:24.265435	цвй
5	7	32	2024-12-24 17:24:38.866651	ewffeefwef
\.


--
-- TOC entry 4885 (class 0 OID 24621)
-- Dependencies: 224
-- Data for Name: stages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stages (id, name, job_id) FROM stdin;
7	No Stage	1
12	Interview	20
13	No Stage	21
18	No Stage	17
23	Well	22
26	Initial	25
27	DLebetskyStage	26
28	Test1	30
29	Test2	30
30	Test3	30
31	Hr interview	17
32	Wwdq	33
33	No Stage	\N
34	No Stage	\N
35	No Stage	\N
36	No Stage	\N
37	No Stage	\N
38	No Stage	\N
39	No Stage	\N
40	No Stage	\N
\.


--
-- TOC entry 4877 (class 0 OID 16416)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, role) FROM stdin;
2	dmitry.lebetsky	$2a$10$1gup13thfDR1NCMfpM3yxu4jwRO1iVUjYOo5z3DuQloEUsi62l0jG	recruiter
4	admin	$2a$10$zU7UvvZRFRV/SaylSc3yNOyht.o92rN2HCWOGgN3o3HtTaggbaO6e	admin
7	recruiter	$2a$10$6cKpuCXou0wBww7eYI32qufwFoLWzpbRWFcTCyxlLqcGgYbVmc1Jm	recruiter
8	testuser	$2a$10$dM6kJoBeAoEGEorC8F5x3eSn5xlz5AVCG/9eBKUu4b06UoH7rP7Py	admin
\.


--
-- TOC entry 4911 (class 0 OID 0)
-- Dependencies: 227
-- Name: action_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.action_log_id_seq', 53, true);


--
-- TOC entry 4912 (class 0 OID 0)
-- Dependencies: 229
-- Name: candidate_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidate_comment_id_seq', 6, true);


--
-- TOC entry 4913 (class 0 OID 0)
-- Dependencies: 225
-- Name: candidate_stage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidate_stage_id_seq', 98, true);


--
-- TOC entry 4914 (class 0 OID 0)
-- Dependencies: 221
-- Name: candidates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidates_id_seq', 36, true);


--
-- TOC entry 4915 (class 0 OID 0)
-- Dependencies: 217
-- Name: job_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_type_id_seq', 6, true);


--
-- TOC entry 4916 (class 0 OID 0)
-- Dependencies: 219
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_id_seq', 41, true);


--
-- TOC entry 4917 (class 0 OID 0)
-- Dependencies: 233
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 44, true);


--
-- TOC entry 4918 (class 0 OID 0)
-- Dependencies: 231
-- Name: report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.report_id_seq', 5, true);


--
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 223
-- Name: stages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stages_id_seq', 40, true);


--
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 18, true);


--
-- TOC entry 4713 (class 2606 OID 32805)
-- Name: action_log action_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_log
    ADD CONSTRAINT action_log_pkey PRIMARY KEY (id);


--
-- TOC entry 4715 (class 2606 OID 32822)
-- Name: candidate_comment candidate_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_comment
    ADD CONSTRAINT candidate_comment_pkey PRIMARY KEY (id);


--
-- TOC entry 4711 (class 2606 OID 24639)
-- Name: candidate_stage candidate_stage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_stage
    ADD CONSTRAINT candidate_stage_pkey PRIMARY KEY (id);


--
-- TOC entry 4707 (class 2606 OID 24614)
-- Name: candidates candidates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_pkey PRIMARY KEY (id);


--
-- TOC entry 4703 (class 2606 OID 16440)
-- Name: job_type job_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_type
    ADD CONSTRAINT job_type_pkey PRIMARY KEY (id);


--
-- TOC entry 4705 (class 2606 OID 16450)
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 4719 (class 2606 OID 41055)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4717 (class 2606 OID 32842)
-- Name: report report_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_pkey PRIMARY KEY (id);


--
-- TOC entry 4709 (class 2606 OID 24626)
-- Name: stages stages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stages
    ADD CONSTRAINT stages_pkey PRIMARY KEY (id);


--
-- TOC entry 4699 (class 2606 OID 16421)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4701 (class 2606 OID 16423)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4732 (class 2620 OID 41062)
-- Name: candidates candidate_action_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER candidate_action_trigger AFTER INSERT OR DELETE OR UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION public.log_candidate_action();


--
-- TOC entry 4731 (class 2620 OID 41029)
-- Name: jobs trigger_log_job; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_log_job AFTER INSERT OR DELETE OR UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.log_job_action();


--
-- TOC entry 4725 (class 2606 OID 32806)
-- Name: action_log action_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_log
    ADD CONSTRAINT action_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4726 (class 2606 OID 40990)
-- Name: candidate_comment candidate_comment_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_comment
    ADD CONSTRAINT candidate_comment_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE;


--
-- TOC entry 4727 (class 2606 OID 41030)
-- Name: candidate_comment candidate_comment_recruiter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_comment
    ADD CONSTRAINT candidate_comment_recruiter_id_fkey FOREIGN KEY (recruiter_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4723 (class 2606 OID 24640)
-- Name: candidate_stage candidate_stage_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_stage
    ADD CONSTRAINT candidate_stage_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id);


--
-- TOC entry 4724 (class 2606 OID 41015)
-- Name: candidate_stage candidate_stage_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_stage
    ADD CONSTRAINT candidate_stage_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.stages(id) ON DELETE CASCADE;


--
-- TOC entry 4721 (class 2606 OID 41010)
-- Name: candidates candidates_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- TOC entry 4720 (class 2606 OID 16451)
-- Name: jobs jobs_job_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_job_type_id_fkey FOREIGN KEY (job_type_id) REFERENCES public.job_type(id);


--
-- TOC entry 4730 (class 2606 OID 41056)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4728 (class 2606 OID 41040)
-- Name: report report_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- TOC entry 4729 (class 2606 OID 41035)
-- Name: report report_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4722 (class 2606 OID 41000)
-- Name: stages stages_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stages
    ADD CONSTRAINT stages_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


-- Completed on 2024-12-27 03:58:14

--
-- PostgreSQL database dump complete
--

