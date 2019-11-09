--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2
-- Dumped by pg_dump version 11.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: group; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public."group" (
    id integer NOT NULL,
    name character varying,
    description character varying
);



--
-- Name: group_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.group_id_seq OWNED BY public."group".id;


--
-- Name: hub; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.hub (
    id integer NOT NULL,
    name character varying NOT NULL,
    image character varying NOT NULL
);



--
-- Name: hub_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.hub_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: hub_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.hub_id_seq OWNED BY public.hub.id;


--
-- Name: image; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.image (
    id integer NOT NULL,
    image character varying
);



--
-- Name: image_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.image_id_seq OWNED BY public.image.id;


--
-- Name: in_app_notification; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.in_app_notification (
    id integer NOT NULL,
    text character varying NOT NULL,
    date character varying NOT NULL,
    thumbnail character varying,
    "actionLink" character varying
);



--
-- Name: in_app_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.in_app_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: in_app_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.in_app_notification_id_seq OWNED BY public.in_app_notification.id;


--
-- Name: invite; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.invite (
    id integer NOT NULL,
    email character varying NOT NULL
);



--
-- Name: invite_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.invite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: invite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.invite_id_seq OWNED BY public.invite.id;


--
-- Name: join_person_image; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.join_person_image (
    "personId" integer NOT NULL,
    "imageId" integer NOT NULL,
    "personDescriptorId" integer NOT NULL,
    "locationId" integer,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



--
-- Name: join_user_group; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.join_user_group (
    "userId" integer NOT NULL,
    "locationId" integer NOT NULL,
    "groupId" integer
);



--
-- Name: join_user_hub; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.join_user_hub (
    "userId" integer NOT NULL,
    "hubId" integer NOT NULL,
    "isOwner" boolean NOT NULL
);



--
-- Name: join_user_in_app_notifications; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.join_user_in_app_notifications (
    "userId" integer NOT NULL,
    "inAppNotificationId" integer NOT NULL
);



--
-- Name: join_user_location; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.join_user_location (
    "userId" integer NOT NULL,
    "locationId" integer NOT NULL
);



--
-- Name: location; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.location (
    id integer NOT NULL,
    name character varying,
    description character varying,
    latitude character varying,
    longitude character varying
);



--
-- Name: location_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.location_id_seq OWNED BY public.location.id;


--
-- Name: password_reset; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.password_reset (
    id integer NOT NULL,
    pin character varying NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



--
-- Name: password_reset_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.password_reset_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: password_reset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.password_reset_id_seq OWNED BY public.password_reset.id;


--
-- Name: person; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.person (
    id integer NOT NULL,
    name character varying
);



--
-- Name: person_descriptor; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.person_descriptor (
    id integer NOT NULL,
    descriptor numeric[],
    x numeric NOT NULL,
    y numeric NOT NULL,
    height numeric NOT NULL,
    width numeric NOT NULL
);



--
-- Name: person_descriptor_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.person_descriptor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: person_descriptor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.person_descriptor_id_seq OWNED BY public.person_descriptor.id;


--
-- Name: person_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;


--
-- Name: persons_face; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.persons_face (
    id integer NOT NULL,
    name character varying,
    image character varying,
    descriptor numeric[]
);



--
-- Name: persons_face_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.persons_face_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: persons_face_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.persons_face_id_seq OWNED BY public.persons_face.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    email text NOT NULL,
    password character varying NOT NULL,
    "passwordResetId" integer
);



--
-- Name: user_device; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.user_device (
    id integer NOT NULL,
    "fcmPushUserToken" text NOT NULL,
    "userId" integer NOT NULL
);



--
-- Name: user_device_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.user_device_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: user_device_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.user_device_id_seq OWNED BY public.user_device.id;


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: group id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public."group" ALTER COLUMN id SET DEFAULT nextval('public.group_id_seq'::regclass);


--
-- Name: hub id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.hub ALTER COLUMN id SET DEFAULT nextval('public.hub_id_seq'::regclass);


--
-- Name: image id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.image ALTER COLUMN id SET DEFAULT nextval('public.image_id_seq'::regclass);


--
-- Name: in_app_notification id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.in_app_notification ALTER COLUMN id SET DEFAULT nextval('public.in_app_notification_id_seq'::regclass);


--
-- Name: invite id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.invite ALTER COLUMN id SET DEFAULT nextval('public.invite_id_seq'::regclass);


--
-- Name: location id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.location ALTER COLUMN id SET DEFAULT nextval('public.location_id_seq'::regclass);


--
-- Name: password_reset id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.password_reset ALTER COLUMN id SET DEFAULT nextval('public.password_reset_id_seq'::regclass);


--
-- Name: person id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);


--
-- Name: person_descriptor id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.person_descriptor ALTER COLUMN id SET DEFAULT nextval('public.person_descriptor_id_seq'::regclass);


--
-- Name: persons_face id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.persons_face ALTER COLUMN id SET DEFAULT nextval('public.persons_face_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: user_device id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.user_device ALTER COLUMN id SET DEFAULT nextval('public.user_device_id_seq'::regclass);


--
-- Name: persons_face PK_0103040298254e232d0d8f754a3; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.persons_face
    ADD CONSTRAINT "PK_0103040298254e232d0d8f754a3" PRIMARY KEY (id);


--
-- Name: user_device PK_0232591a0b48e1eb92f3ec5d0d1; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.user_device
    ADD CONSTRAINT "PK_0232591a0b48e1eb92f3ec5d0d1" PRIMARY KEY (id);


--
-- Name: join_user_group PK_02c648cd4e69f7f2326fd9276fd; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_user_group
    ADD CONSTRAINT "PK_02c648cd4e69f7f2326fd9276fd" PRIMARY KEY ("userId", "locationId");


--
-- Name: group PK_256aa0fda9b1de1a73ee0b7106b; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY (id);


--
-- Name: hub PK_3e44a0e97127ddd25d60430b924; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.hub
    ADD CONSTRAINT "PK_3e44a0e97127ddd25d60430b924" PRIMARY KEY (id);


--
-- Name: person PK_5fdaf670315c4b7e70cce85daa3; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY (id);


--
-- Name: join_user_hub PK_712e6729d6544114c10cd4a2fa7; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_user_hub
    ADD CONSTRAINT "PK_712e6729d6544114c10cd4a2fa7" PRIMARY KEY ("userId", "hubId");


--
-- Name: person_descriptor PK_7719c42e299644100eee87e98f4; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.person_descriptor
    ADD CONSTRAINT "PK_7719c42e299644100eee87e98f4" PRIMARY KEY (id);


--
-- Name: password_reset PK_8515e60a2cc41584fa4784f52ce; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.password_reset
    ADD CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce" PRIMARY KEY (id);


--
-- Name: location PK_876d7bdba03c72251ec4c2dc827; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY (id);


--
-- Name: join_user_in_app_notifications PK_88fdc209e87a69b0a9024d37dd6; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_user_in_app_notifications
    ADD CONSTRAINT "PK_88fdc209e87a69b0a9024d37dd6" PRIMARY KEY ("userId", "inAppNotificationId");


--
-- Name: in_app_notification PK_9c57597f8e042ab80df73847de4; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.in_app_notification
    ADD CONSTRAINT "PK_9c57597f8e042ab80df73847de4" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: join_person_image PK_d6bbce6d30d324e5c968d1445be; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_person_image
    ADD CONSTRAINT "PK_d6bbce6d30d324e5c968d1445be" PRIMARY KEY ("personId", "imageId");


--
-- Name: image PK_d6db1ab4ee9ad9dbe86c64e4cc3; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY (id);


--
-- Name: join_user_location PK_ed594d305ba60643ae466a0dbc9; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_user_location
    ADD CONSTRAINT "PK_ed594d305ba60643ae466a0dbc9" PRIMARY KEY ("userId", "locationId");


--
-- Name: invite PK_fc9fa190e5a3c5d80604a4f63e1; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT "PK_fc9fa190e5a3c5d80604a4f63e1" PRIMARY KEY (id);


--
-- Name: join_person_image REL_51086f77f13afca5c5df0543eb; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_person_image
    ADD CONSTRAINT "REL_51086f77f13afca5c5df0543eb" UNIQUE ("locationId");


--
-- Name: join_person_image REL_51e372b060cabde552c4dcb69a; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_person_image
    ADD CONSTRAINT "REL_51e372b060cabde552c4dcb69a" UNIQUE ("personDescriptorId");


--
-- Name: user REL_5d250ff0a3f3eba15ff2db819d; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "REL_5d250ff0a3f3eba15ff2db819d" UNIQUE ("passwordResetId");


--
-- Name: user_device UQ_9fa10355d40f3311b221b15c04c; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.user_device
    ADD CONSTRAINT "UQ_9fa10355d40f3311b221b15c04c" UNIQUE ("fcmPushUserToken");


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: join_user_location FK_225f5a7155bf4e84ac7b852488f; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_user_location
    ADD CONSTRAINT "FK_225f5a7155bf4e84ac7b852488f" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: join_person_image FK_24b5eaf6da0b73d2bcffcc6a451; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_person_image
    ADD CONSTRAINT "FK_24b5eaf6da0b73d2bcffcc6a451" FOREIGN KEY ("imageId") REFERENCES public.image(id);


--
-- Name: join_person_image FK_51086f77f13afca5c5df0543ebf; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_person_image
    ADD CONSTRAINT "FK_51086f77f13afca5c5df0543ebf" FOREIGN KEY ("locationId") REFERENCES public.location(id);


--
-- Name: join_person_image FK_51e372b060cabde552c4dcb69a4; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_person_image
    ADD CONSTRAINT "FK_51e372b060cabde552c4dcb69a4" FOREIGN KEY ("personDescriptorId") REFERENCES public.person_descriptor(id);


--
-- Name: join_person_image FK_5547e6bb93fa200931f6afbbb2f; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_person_image
    ADD CONSTRAINT "FK_5547e6bb93fa200931f6afbbb2f" FOREIGN KEY ("personId") REFERENCES public.person(id);


--
-- Name: join_user_in_app_notifications FK_5a574454bde0417279789491071; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_user_in_app_notifications
    ADD CONSTRAINT "FK_5a574454bde0417279789491071" FOREIGN KEY ("inAppNotificationId") REFERENCES public.in_app_notification(id);


--
-- Name: user FK_5d250ff0a3f3eba15ff2db819dd; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_5d250ff0a3f3eba15ff2db819dd" FOREIGN KEY ("passwordResetId") REFERENCES public.password_reset(id);


--
-- Name: join_user_hub FK_77f66af41fadebe148e9717499d; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_user_hub
    ADD CONSTRAINT "FK_77f66af41fadebe148e9717499d" FOREIGN KEY ("hubId") REFERENCES public.hub(id);


--
-- Name: join_user_hub FK_9b7e78f7bcde729db66f0981bf8; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_user_hub
    ADD CONSTRAINT "FK_9b7e78f7bcde729db66f0981bf8" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: user_device FK_bda1afb30d9e3e8fb30b1e90af7; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.user_device
    ADD CONSTRAINT "FK_bda1afb30d9e3e8fb30b1e90af7" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: join_user_group FK_d231827af7b3b889d62f6ebb3e5; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_user_group
    ADD CONSTRAINT "FK_d231827af7b3b889d62f6ebb3e5" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: join_user_in_app_notifications FK_d342396ba51c5ed48dfef10fe28; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_user_in_app_notifications
    ADD CONSTRAINT "FK_d342396ba51c5ed48dfef10fe28" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: join_user_group FK_ebc9c865bc14710e2fd94b26b89; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_user_group
    ADD CONSTRAINT "FK_ebc9c865bc14710e2fd94b26b89" FOREIGN KEY ("groupId") REFERENCES public."group"(id);


--
-- Name: join_user_location FK_ef1e2e914a8bc1218d504e52528; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.join_user_location
    ADD CONSTRAINT "FK_ef1e2e914a8bc1218d504e52528" FOREIGN KEY ("locationId") REFERENCES public.location(id);


--
-- PostgreSQL database dump complete
--

