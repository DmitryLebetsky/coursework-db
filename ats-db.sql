PGDMP  7                    |            ats_database    16.4    16.4 Z    "           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            #           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            $           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            %           1262    16414    ats_database    DATABASE     �   CREATE DATABASE ats_database WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Belarus.1251';
    DROP DATABASE ats_database;
                postgres    false            �            1255    41027    log_candidate_action()    FUNCTION     �  CREATE FUNCTION public.log_candidate_action() RETURNS trigger
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
 -   DROP FUNCTION public.log_candidate_action();
       public          postgres    false            �            1255    41025    log_job_action()    FUNCTION     A  CREATE FUNCTION public.log_job_action() RETURNS trigger
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
 '   DROP FUNCTION public.log_job_action();
       public          postgres    false            �            1259    32799 
   action_log    TABLE     �   CREATE TABLE public.action_log (
    id integer NOT NULL,
    user_id integer,
    action character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.action_log;
       public         heap    postgres    false            �            1259    32798    action_log_id_seq    SEQUENCE     �   CREATE SEQUENCE public.action_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.action_log_id_seq;
       public          postgres    false    228            &           0    0    action_log_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.action_log_id_seq OWNED BY public.action_log.id;
          public          postgres    false    227            �            1259    32814    candidate_comment    TABLE     �   CREATE TABLE public.candidate_comment (
    id integer NOT NULL,
    candidate_id integer,
    recruiter_id integer,
    comment text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 %   DROP TABLE public.candidate_comment;
       public         heap    postgres    false            �            1259    32813    candidate_comment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.candidate_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.candidate_comment_id_seq;
       public          postgres    false    230            '           0    0    candidate_comment_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.candidate_comment_id_seq OWNED BY public.candidate_comment.id;
          public          postgres    false    229            �            1259    24633    candidate_stage    TABLE     �   CREATE TABLE public.candidate_stage (
    id integer NOT NULL,
    candidate_id integer,
    stage_id integer,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 #   DROP TABLE public.candidate_stage;
       public         heap    postgres    false            �            1259    24632    candidate_stage_id_seq    SEQUENCE     �   CREATE SEQUENCE public.candidate_stage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.candidate_stage_id_seq;
       public          postgres    false    226            (           0    0    candidate_stage_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.candidate_stage_id_seq OWNED BY public.candidate_stage.id;
          public          postgres    false    225            �            1259    24607 
   candidates    TABLE     �   CREATE TABLE public.candidates (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    resume text,
    job_id integer
);
    DROP TABLE public.candidates;
       public         heap    postgres    false            �            1259    24606    candidates_id_seq    SEQUENCE     �   CREATE SEQUENCE public.candidates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.candidates_id_seq;
       public          postgres    false    222            )           0    0    candidates_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.candidates_id_seq OWNED BY public.candidates.id;
          public          postgres    false    221            �            1259    16435    job_type    TABLE     h   CREATE TABLE public.job_type (
    id integer NOT NULL,
    type_name character varying(50) NOT NULL
);
    DROP TABLE public.job_type;
       public         heap    postgres    false            �            1259    16434    job_type_id_seq    SEQUENCE     �   CREATE SEQUENCE public.job_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.job_type_id_seq;
       public          postgres    false    218            *           0    0    job_type_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.job_type_id_seq OWNED BY public.job_type.id;
          public          postgres    false    217            �            1259    16442    jobs    TABLE     5  CREATE TABLE public.jobs (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    job_type_id integer,
    status character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    closed_at timestamp without time zone
);
    DROP TABLE public.jobs;
       public         heap    postgres    false            �            1259    16441    jobs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.jobs_id_seq;
       public          postgres    false    220            +           0    0    jobs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;
          public          postgres    false    219            �            1259    41046    notifications    TABLE     �   CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 !   DROP TABLE public.notifications;
       public         heap    postgres    false            �            1259    41045    notifications_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.notifications_id_seq;
       public          postgres    false    234            ,           0    0    notifications_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;
          public          postgres    false    233            �            1259    32834    report    TABLE     �   CREATE TABLE public.report (
    id integer NOT NULL,
    user_id integer,
    job_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    content text NOT NULL
);
    DROP TABLE public.report;
       public         heap    postgres    false            �            1259    32833    report_id_seq    SEQUENCE     �   CREATE SEQUENCE public.report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.report_id_seq;
       public          postgres    false    232            -           0    0    report_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.report_id_seq OWNED BY public.report.id;
          public          postgres    false    231            �            1259    24621    stages    TABLE     u   CREATE TABLE public.stages (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    job_id integer
);
    DROP TABLE public.stages;
       public         heap    postgres    false            �            1259    24620    stages_id_seq    SEQUENCE     �   CREATE SEQUENCE public.stages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.stages_id_seq;
       public          postgres    false    224            .           0    0    stages_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.stages_id_seq OWNED BY public.stages.id;
          public          postgres    false    223            �            1259    16416    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16415    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    216            /           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    215            Q           2604    32802    action_log id    DEFAULT     n   ALTER TABLE ONLY public.action_log ALTER COLUMN id SET DEFAULT nextval('public.action_log_id_seq'::regclass);
 <   ALTER TABLE public.action_log ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    228    228            S           2604    32817    candidate_comment id    DEFAULT     |   ALTER TABLE ONLY public.candidate_comment ALTER COLUMN id SET DEFAULT nextval('public.candidate_comment_id_seq'::regclass);
 C   ALTER TABLE public.candidate_comment ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    229    230            O           2604    24636    candidate_stage id    DEFAULT     x   ALTER TABLE ONLY public.candidate_stage ALTER COLUMN id SET DEFAULT nextval('public.candidate_stage_id_seq'::regclass);
 A   ALTER TABLE public.candidate_stage ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    226    226            M           2604    24610    candidates id    DEFAULT     n   ALTER TABLE ONLY public.candidates ALTER COLUMN id SET DEFAULT nextval('public.candidates_id_seq'::regclass);
 <   ALTER TABLE public.candidates ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222            J           2604    16438    job_type id    DEFAULT     j   ALTER TABLE ONLY public.job_type ALTER COLUMN id SET DEFAULT nextval('public.job_type_id_seq'::regclass);
 :   ALTER TABLE public.job_type ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            K           2604    16445    jobs id    DEFAULT     b   ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);
 6   ALTER TABLE public.jobs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219    220            W           2604    41049    notifications id    DEFAULT     t   ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);
 ?   ALTER TABLE public.notifications ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    234    233    234            U           2604    32837 	   report id    DEFAULT     f   ALTER TABLE ONLY public.report ALTER COLUMN id SET DEFAULT nextval('public.report_id_seq'::regclass);
 8   ALTER TABLE public.report ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    232    232            N           2604    24624 	   stages id    DEFAULT     f   ALTER TABLE ONLY public.stages ALTER COLUMN id SET DEFAULT nextval('public.stages_id_seq'::regclass);
 8   ALTER TABLE public.stages ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            I           2604    16419    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216                      0    32799 
   action_log 
   TABLE DATA           E   COPY public.action_log (id, user_id, action, created_at) FROM stdin;
    public          postgres    false    228   �m                 0    32814    candidate_comment 
   TABLE DATA           `   COPY public.candidate_comment (id, candidate_id, recruiter_id, comment, created_at) FROM stdin;
    public          postgres    false    230   �p                 0    24633    candidate_stage 
   TABLE DATA           Q   COPY public.candidate_stage (id, candidate_id, stage_id, updated_at) FROM stdin;
    public          postgres    false    226   �q                 0    24607 
   candidates 
   TABLE DATA           E   COPY public.candidates (id, name, email, resume, job_id) FROM stdin;
    public          postgres    false    222   ms                 0    16435    job_type 
   TABLE DATA           1   COPY public.job_type (id, type_name) FROM stdin;
    public          postgres    false    218   tu                 0    16442    jobs 
   TABLE DATA           b   COPY public.jobs (id, title, description, job_type_id, status, created_at, closed_at) FROM stdin;
    public          postgres    false    220   �u                 0    41046    notifications 
   TABLE DATA           R   COPY public.notifications (id, user_id, message, is_read, created_at) FROM stdin;
    public          postgres    false    234   �w                 0    32834    report 
   TABLE DATA           J   COPY public.report (id, user_id, job_id, created_at, content) FROM stdin;
    public          postgres    false    232   �y                 0    24621    stages 
   TABLE DATA           2   COPY public.stages (id, name, job_id) FROM stdin;
    public          postgres    false    224   �z                 0    16416    users 
   TABLE DATA           =   COPY public.users (id, username, password, role) FROM stdin;
    public          postgres    false    216   u{       0           0    0    action_log_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.action_log_id_seq', 53, true);
          public          postgres    false    227            1           0    0    candidate_comment_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.candidate_comment_id_seq', 6, true);
          public          postgres    false    229            2           0    0    candidate_stage_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.candidate_stage_id_seq', 98, true);
          public          postgres    false    225            3           0    0    candidates_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.candidates_id_seq', 36, true);
          public          postgres    false    221            4           0    0    job_type_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.job_type_id_seq', 6, true);
          public          postgres    false    217            5           0    0    jobs_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.jobs_id_seq', 41, true);
          public          postgres    false    219            6           0    0    notifications_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.notifications_id_seq', 44, true);
          public          postgres    false    233            7           0    0    report_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.report_id_seq', 5, true);
          public          postgres    false    231            8           0    0    stages_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.stages_id_seq', 40, true);
          public          postgres    false    223            9           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 18, true);
          public          postgres    false    215            i           2606    32805    action_log action_log_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.action_log
    ADD CONSTRAINT action_log_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.action_log DROP CONSTRAINT action_log_pkey;
       public            postgres    false    228            k           2606    32822 (   candidate_comment candidate_comment_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.candidate_comment
    ADD CONSTRAINT candidate_comment_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.candidate_comment DROP CONSTRAINT candidate_comment_pkey;
       public            postgres    false    230            g           2606    24639 $   candidate_stage candidate_stage_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.candidate_stage
    ADD CONSTRAINT candidate_stage_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.candidate_stage DROP CONSTRAINT candidate_stage_pkey;
       public            postgres    false    226            c           2606    24614    candidates candidates_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.candidates DROP CONSTRAINT candidates_pkey;
       public            postgres    false    222            _           2606    16440    job_type job_type_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.job_type
    ADD CONSTRAINT job_type_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.job_type DROP CONSTRAINT job_type_pkey;
       public            postgres    false    218            a           2606    16450    jobs jobs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.jobs DROP CONSTRAINT jobs_pkey;
       public            postgres    false    220            o           2606    41055     notifications notifications_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public            postgres    false    234            m           2606    32842    report report_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.report DROP CONSTRAINT report_pkey;
       public            postgres    false    232            e           2606    24626    stages stages_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.stages
    ADD CONSTRAINT stages_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.stages DROP CONSTRAINT stages_pkey;
       public            postgres    false    224            [           2606    16421    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            ]           2606    16423    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    216            |           2620    41062 #   candidates candidate_action_trigger    TRIGGER     �   CREATE TRIGGER candidate_action_trigger AFTER INSERT OR DELETE OR UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION public.log_candidate_action();
 <   DROP TRIGGER candidate_action_trigger ON public.candidates;
       public          postgres    false    222    236            {           2620    41029    jobs trigger_log_job    TRIGGER     �   CREATE TRIGGER trigger_log_job AFTER INSERT OR DELETE OR UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.log_job_action();
 -   DROP TRIGGER trigger_log_job ON public.jobs;
       public          postgres    false    235    220            u           2606    32806 "   action_log action_log_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.action_log
    ADD CONSTRAINT action_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 L   ALTER TABLE ONLY public.action_log DROP CONSTRAINT action_log_user_id_fkey;
       public          postgres    false    4699    228    216            v           2606    40990 5   candidate_comment candidate_comment_candidate_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.candidate_comment
    ADD CONSTRAINT candidate_comment_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.candidate_comment DROP CONSTRAINT candidate_comment_candidate_id_fkey;
       public          postgres    false    230    222    4707            w           2606    41030 5   candidate_comment candidate_comment_recruiter_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.candidate_comment
    ADD CONSTRAINT candidate_comment_recruiter_id_fkey FOREIGN KEY (recruiter_id) REFERENCES public.users(id) ON DELETE SET NULL;
 _   ALTER TABLE ONLY public.candidate_comment DROP CONSTRAINT candidate_comment_recruiter_id_fkey;
       public          postgres    false    4699    230    216            s           2606    24640 1   candidate_stage candidate_stage_candidate_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.candidate_stage
    ADD CONSTRAINT candidate_stage_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id);
 [   ALTER TABLE ONLY public.candidate_stage DROP CONSTRAINT candidate_stage_candidate_id_fkey;
       public          postgres    false    222    226    4707            t           2606    41015 -   candidate_stage candidate_stage_stage_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.candidate_stage
    ADD CONSTRAINT candidate_stage_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.stages(id) ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.candidate_stage DROP CONSTRAINT candidate_stage_stage_id_fkey;
       public          postgres    false    226    4709    224            q           2606    41010 !   candidates candidates_job_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.candidates DROP CONSTRAINT candidates_job_id_fkey;
       public          postgres    false    4705    222    220            p           2606    16451    jobs jobs_job_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_job_type_id_fkey FOREIGN KEY (job_type_id) REFERENCES public.job_type(id);
 D   ALTER TABLE ONLY public.jobs DROP CONSTRAINT jobs_job_type_id_fkey;
       public          postgres    false    218    220    4703            z           2606    41056 (   notifications notifications_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 R   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_user_id_fkey;
       public          postgres    false    216    234    4699            x           2606    41040    report report_job_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.report DROP CONSTRAINT report_job_id_fkey;
       public          postgres    false    232    220    4705            y           2606    41035    report report_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
 D   ALTER TABLE ONLY public.report DROP CONSTRAINT report_user_id_fkey;
       public          postgres    false    232    216    4699            r           2606    41000    stages stages_job_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.stages
    ADD CONSTRAINT stages_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.stages DROP CONSTRAINT stages_job_id_fkey;
       public          postgres    false    220    224    4705                 x����nQ���S����vn;D7��@lؤ�)
�N/#"������M�d�J������'t���[]���/K��jX���y�����<�)�)a�Z|($.������#�|1R���b���?����l(LN��, c���|�/�j������L�=�v1zb�k}�����B�xvB)J�P�wmk���]����i�<n#4C_�5��q�h?�c�8)�켻�ǟf�H���L,H�E���O�{YI���Pb���r�.*E����D1d@?y�E?���W��1����(����k��p.�\�� ���ZiM�?�2��zG��f���ƹ`v*ɲ�lӆM��K�G!D
Y�`�>wksz��XPL)�1���i_�M{�iG�͈��>S}h�`�ݦ�������U95�[��	�6WI��F:_�����}���\����Yw�-��FX3д��P*3&! Y�i�,�6l+�l�l�(.˴���2!�W��@e[C@ya��(:ۜ�#�_X���Y20P�4%��l� b�ㅭ�zNl��������ݮ���S=lV]s���n���a>NN��u"�!a��>pJ��'g���@X�����v9M$�G���j!�P/Z����B7�mFq�>⏗{&�dJ �]p`bD��ށ�j�H� �w��=GY���`؎�rͧG
���nH8R�}���$.nfQ�k�������&�"��U[�$�O��:n'#���X�=�aO�t��� j��nO2f���x_         �   x�e�M
�0F��)r���L�4�*�B<���-��6 ^����F6 (�,��{�F�f�Ee�WuU/.u8�)�C���.�VLMݶ�d��J �irZIkq��=o�c�����ri*3mA�d����}HH��H �,�c����f.%	�h0|)vس��}���j�:߇�C"����2��$���F�         �  x�}��q$!D�)+䀈����ߎ���I;���IVv�����������i�-�隂BC�D�%�	��
"�S�DѠF@l|~���AxD���o*l�H:��
��[��8Q�5t�p���$RZc�q��g"�@uԑH�ְ]fO$��t�tD�\Ac���ұ�Q䮉�.�B���xOL� �]�Dx��5$ft�C�b�qe}��N#֤. 8�4�BR�:���;�m	�n+�C��9|u�jV�W@��9O"Q�5�ww��t�J��]��3�ؤ��ub�f:�]Y��dbERA�`��OƖ��J2d�W��b̌z�l~�#o��1-�J �q��'��U��:���^ߘn�.�)��$@���o=�2���E��+�~,2ܳ�dE����ľ���h�sn?*����?����         �  x�mSmn�0�M�B'b�M�m�]�u@lP�P-�Qb�����Qv���G����mR|��gpG'oa˂!��W]�%Nr���k�ޢ��H�,�uY��+�/��|�;-�	d���kt��:�.����eQi[�1P˰9�b��d�%�5-�L,�ʘo�����.�jM��Ǩ���8�?��+*�3@���٘Ma�!*�� �D���U
�ep�Y�Qʬ�]\ؗ��
�Ir6��9�9�u�Cg�� }K>	}wڡ|�l���Ő�ш�j��D'C��եQ���Z֞�d�L���䍴NJ8Y��Z�J��7�3�^r��駑f��x�Ƈ�D�5꽫�g!�}�~8��F���1T\Q&Tk�A�w bg١��-���O!�h����RB����?}7�7<������VT�+SYE3���g
�΅Z��
_0�]w�	8�hy��\���mӔ�M�,�R�s��FVZ�{��|ܠ�{�4B��I�         .   x�3��M�KLO-�2�tT�*���/�2�tI-K��/ ���qqq ��	           x�uS�n�0<S_�[O&��$E���"0rp�K.�E��-���K)H�G.������̂�}�]��f)�u�K/o�R�vu��]��x��ծiS%P�� Lt)��hH��R�%� H0�\���)�/?_���1Om'��S$�c:\!m�	 ��\���%��T���<�����,�����Ȏ�Ŭ�e�}k�9�o��/���F9K�C��ω��;���u������,���H�~���֓a(��
�s�jS�r��@�3���_����֮���T�0E&W�tZ�T��Cvܳ�ˋ\�7��zY�ZGt�2�Kn��ub����k�����c��)a�F{�H����M�hvEi��leW���"�d=��]�0[����W���!Z�/��+�IӘ�pG�؜L���f<��Aҟ�2(�>�k��h�B[Z6�D!B>/(ޣEs���n#��|�|Jc�0��y�,���1.�ê�ǈ�~D"�|�­��~�>0s��<?p���-���C񪊢�6�)�         �  x����n1���S�Yy>��תʵ�^HX$��(��Y���q�k����?���@��t�}?��^O��t�����t<��/�����2P"yBz"�%�����*���?OmZ����3g�A�iN��\�t�B��ae���T�љ�(h������#�ask�_������,qU��
���UZ�0����t��{+s����b���Z�Z��P�[���&��JB'@n��������]J5QMQԓ��
�"9s�I[�]��n�6�~��m���d��G��<Lk��-m�ˊ,��zrޤ�
v���ɩDo�:r.2Q�䎜�T��ґs�f^��'g����L���'�M�
�{r.�,V[zrޤ��w��T�F��X�SG�E�cGΛ�Iـ�#�"�Ɂ{�z�cqE�3�ii~O{��]�ܡ�9�Ȝ���1�u��<��|Ux��KM�!����D��װ}=d<H�}a�3?�fK!������� ���]Z�" ���Cb��m�?A���         �   x�U�1N1E��)��<c��q���"E)i2�,�vQio��q�p#ܠ��_���	�qX/��$K�>ZN���A�mz�C[����ߵ'-X�?�������gk�n�\G=:�C̴���O��T��#ru����_E�i�M�����7�O���	���N�k��(�|�/��/#���H�R�7��1
��]���ڙgk���+B         �   x�U�A
�@E��)z�I�N�w� �(t�M� ��b;X��� �����g��_,Z��dzzY�Z���ju�Z B*c��G+�lr�0�^�r�T�I�`�R��>�&1'���2���0A�\���Z�5ȹ�Bk��i���Js��� ���L�           x�M�Kr�0  �5���"�KE���J���`4!���i{�7�P�ג39 8ü�HE3R�(D ?��!����BىQՆ(#T%5{8�.PSZ�+Oa8g�䘩#%��oO�G6z<>C7���T�}��3Љ�|c�āW���%?�E����	�~�O��׵p>���Y��8y��]�Z�n���������{E�E����vc�ㆋ�%��eEgxJނ2g����ّޜF�7����Q�[�.m��w�/�5PU���j�     