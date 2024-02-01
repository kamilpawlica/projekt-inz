--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: benefity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.benefity (
    id integer NOT NULL,
    nazwa_benefitu character varying(255)
);


ALTER TABLE public.benefity OWNER TO postgres;

--
-- Name: benefity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.benefity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.benefity_id_seq OWNER TO postgres;

--
-- Name: benefity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.benefity_id_seq OWNED BY public.benefity.id;


--
-- Name: benefity_pracownicy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.benefity_pracownicy (
    googleid character varying(255) NOT NULL,
    id_benefitu integer NOT NULL
);


ALTER TABLE public.benefity_pracownicy OWNER TO postgres;

--
-- Name: dostepnosc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dostepnosc (
    id integer NOT NULL,
    googleid character varying(255),
    dzien_tygodnia date,
    godzina_rozpoczecia time without time zone,
    godzina_zakonczenia time without time zone
);


ALTER TABLE public.dostepnosc OWNER TO postgres;

--
-- Name: dostepnosc_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dostepnosc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dostepnosc_id_seq OWNER TO postgres;

--
-- Name: dostepnosc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dostepnosc_id_seq OWNED BY public.dostepnosc.id;


--
-- Name: kompetencje; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kompetencje (
    id integer NOT NULL,
    nazwa_kompetencji character varying(255)
);


ALTER TABLE public.kompetencje OWNER TO postgres;

--
-- Name: kompetencje_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kompetencje_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kompetencje_id_seq OWNER TO postgres;

--
-- Name: kompetencje_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kompetencje_id_seq OWNED BY public.kompetencje.id;


--
-- Name: kompetencje_pracownicy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kompetencje_pracownicy (
    googleid character varying(255) NOT NULL,
    kompetencje integer NOT NULL
);


ALTER TABLE public.kompetencje_pracownicy OWNER TO postgres;

--
-- Name: nieobecnosci; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nieobecnosci (
    id integer NOT NULL,
    googleid character varying(255),
    data_poczatkowa date,
    data_koncowa date,
    powod character varying(255)
);


ALTER TABLE public.nieobecnosci OWNER TO postgres;

--
-- Name: nieobecnosci_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nieobecnosci_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nieobecnosci_id_seq OWNER TO postgres;

--
-- Name: nieobecnosci_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nieobecnosci_id_seq OWNED BY public.nieobecnosci.id;


--
-- Name: pracownicy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pracownicy (
    googleid character varying(255) NOT NULL,
    imie character varying(50),
    nazwisko character varying(50),
    email character varying(100),
    stanowisko integer,
    typ_umowy integer,
    wynagrodzenie numeric(10,2),
    staz_pracy integer,
    aktywny character varying(3) DEFAULT 'tak'::character varying
);


ALTER TABLE public.pracownicy OWNER TO postgres;

--
-- Name: stanowiska; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stanowiska (
    id integer NOT NULL,
    nazwa_stanowiska character varying(255)
);


ALTER TABLE public.stanowiska OWNER TO postgres;

--
-- Name: stanowiska_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stanowiska_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stanowiska_id_seq OWNER TO postgres;

--
-- Name: stanowiska_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stanowiska_id_seq OWNED BY public.stanowiska.id;


--
-- Name: szkolenia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.szkolenia (
    id integer NOT NULL,
    nazwa_szkolenia character varying(255) NOT NULL,
    opis_szkolenia text,
    data_szkolenia date
);


ALTER TABLE public.szkolenia OWNER TO postgres;

--
-- Name: szkolenia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.szkolenia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.szkolenia_id_seq OWNER TO postgres;

--
-- Name: szkolenia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.szkolenia_id_seq OWNED BY public.szkolenia.id;


--
-- Name: szkolenia_pracownicy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.szkolenia_pracownicy (
    googleid character varying(255) NOT NULL,
    id_szkolenia integer NOT NULL
);


ALTER TABLE public.szkolenia_pracownicy OWNER TO postgres;

--
-- Name: typ_umow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.typ_umow (
    id integer NOT NULL,
    nazwa_typu_umowy character varying(255)
);


ALTER TABLE public.typ_umow OWNER TO postgres;

--
-- Name: typ_umow_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.typ_umow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.typ_umow_id_seq OWNER TO postgres;

--
-- Name: typ_umow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.typ_umow_id_seq OWNED BY public.typ_umow.id;


--
-- Name: urlopy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.urlopy (
    id integer NOT NULL,
    googleid character varying(255),
    data_rozpoczecia date,
    data_zakonczenia date
);


ALTER TABLE public.urlopy OWNER TO postgres;

--
-- Name: urlopy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.urlopy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.urlopy_id_seq OWNER TO postgres;

--
-- Name: urlopy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.urlopy_id_seq OWNED BY public.urlopy.id;


--
-- Name: benefity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.benefity ALTER COLUMN id SET DEFAULT nextval('public.benefity_id_seq'::regclass);


--
-- Name: dostepnosc id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dostepnosc ALTER COLUMN id SET DEFAULT nextval('public.dostepnosc_id_seq'::regclass);


--
-- Name: kompetencje id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kompetencje ALTER COLUMN id SET DEFAULT nextval('public.kompetencje_id_seq'::regclass);


--
-- Name: nieobecnosci id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nieobecnosci ALTER COLUMN id SET DEFAULT nextval('public.nieobecnosci_id_seq'::regclass);


--
-- Name: stanowiska id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stanowiska ALTER COLUMN id SET DEFAULT nextval('public.stanowiska_id_seq'::regclass);


--
-- Name: szkolenia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.szkolenia ALTER COLUMN id SET DEFAULT nextval('public.szkolenia_id_seq'::regclass);


--
-- Name: typ_umow id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.typ_umow ALTER COLUMN id SET DEFAULT nextval('public.typ_umow_id_seq'::regclass);


--
-- Name: urlopy id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.urlopy ALTER COLUMN id SET DEFAULT nextval('public.urlopy_id_seq'::regclass);


--
-- Data for Name: benefity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.benefity (id, nazwa_benefitu) FROM stdin;
23	Pakiet medyczny
24	Karta multisport
25	Dofinansowanie wypoczynku wakacyjnego
26	Darmowe bilety do kina
\.


--
-- Data for Name: benefity_pracownicy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.benefity_pracownicy (googleid, id_benefitu) FROM stdin;
\.


--
-- Data for Name: dostepnosc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dostepnosc (id, googleid, dzien_tygodnia, godzina_rozpoczecia, godzina_zakonczenia) FROM stdin;
\.


--
-- Data for Name: kompetencje; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kompetencje (id, nazwa_kompetencji) FROM stdin;
10	Zarządzanie projektami
11	Zarządzanie zasobami ludzkimi
12	Administracja systemu
13	Analityka danych
\.


--
-- Data for Name: kompetencje_pracownicy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kompetencje_pracownicy (googleid, kompetencje) FROM stdin;
\.


--
-- Data for Name: nieobecnosci; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nieobecnosci (id, googleid, data_poczatkowa, data_koncowa, powod) FROM stdin;
\.


--
-- Data for Name: pracownicy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pracownicy (googleid, imie, nazwisko, email, stanowisko, typ_umowy, wynagrodzenie, staz_pracy, aktywny) FROM stdin;
\.


--
-- Data for Name: stanowiska; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stanowiska (id, nazwa_stanowiska) FROM stdin;
11	Administrator
12	Dyrektor
19	Pracownik biurowy
20	Analityk
\.


--
-- Data for Name: szkolenia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.szkolenia (id, nazwa_szkolenia, opis_szkolenia, data_szkolenia) FROM stdin;
16	Zarządzanie czasem	Efektywne zarządzanie czasem to klucz do osiągania celów zarówno zawodowych, jak i osobistych. Pracownicy uczą się planowania oraz priorytetowania zadań.	2024-02-15
17	Jak rozwinąć swoją karierę zawodową	Dla pracowników, którzy pragną rozwijać swoje umiejętności i awansować w karierze. Szkolenie obejmuje planowanie kariery oraz budowanie umiejętności liderskich.	2024-03-01
18	Efektywne sposoby na stres	Codzienna praca w dynamicznym środowisku może generować stres. To szkolenie pomaga pracownikom zidentyfikować źródła stresu oraz rozwijać zdolności radzenia sobie w stresujących sytuacjach.	2024-03-05
\.


--
-- Data for Name: szkolenia_pracownicy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.szkolenia_pracownicy (googleid, id_szkolenia) FROM stdin;
\.


--
-- Data for Name: typ_umow; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.typ_umow (id, nazwa_typu_umowy) FROM stdin;
1	Umowa o prace
2	Umowa zlecenie
5	B2B
6	Umowa o dzielo
\.


--
-- Data for Name: urlopy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.urlopy (id, googleid, data_rozpoczecia, data_zakonczenia) FROM stdin;
\.


--
-- Name: benefity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.benefity_id_seq', 26, true);


--
-- Name: dostepnosc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dostepnosc_id_seq', 49, true);


--
-- Name: kompetencje_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kompetencje_id_seq', 13, true);


--
-- Name: nieobecnosci_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nieobecnosci_id_seq', 67, true);


--
-- Name: stanowiska_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stanowiska_id_seq', 21, true);


--
-- Name: szkolenia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.szkolenia_id_seq', 18, true);


--
-- Name: typ_umow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.typ_umow_id_seq', 7, true);


--
-- Name: urlopy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.urlopy_id_seq', 47, true);


--
-- Name: benefity benefity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.benefity
    ADD CONSTRAINT benefity_pkey PRIMARY KEY (id);


--
-- Name: benefity_pracownicy benefity_pracownicy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.benefity_pracownicy
    ADD CONSTRAINT benefity_pracownicy_pkey PRIMARY KEY (googleid, id_benefitu);


--
-- Name: dostepnosc dostepnosc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dostepnosc
    ADD CONSTRAINT dostepnosc_pkey PRIMARY KEY (id);


--
-- Name: kompetencje kompetencje_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kompetencje
    ADD CONSTRAINT kompetencje_pkey PRIMARY KEY (id);


--
-- Name: kompetencje_pracownicy kompetencje_pracownicy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kompetencje_pracownicy
    ADD CONSTRAINT kompetencje_pracownicy_pkey PRIMARY KEY (googleid, kompetencje);


--
-- Name: nieobecnosci nieobecnosci_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nieobecnosci
    ADD CONSTRAINT nieobecnosci_pkey PRIMARY KEY (id);


--
-- Name: pracownicy pracownicy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pracownicy
    ADD CONSTRAINT pracownicy_pkey PRIMARY KEY (googleid);


--
-- Name: stanowiska stanowiska_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stanowiska
    ADD CONSTRAINT stanowiska_pkey PRIMARY KEY (id);


--
-- Name: szkolenia szkolenia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.szkolenia
    ADD CONSTRAINT szkolenia_pkey PRIMARY KEY (id);


--
-- Name: szkolenia_pracownicy szkolenia_pracownicy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.szkolenia_pracownicy
    ADD CONSTRAINT szkolenia_pracownicy_pkey PRIMARY KEY (googleid, id_szkolenia);


--
-- Name: typ_umow typ_umow_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.typ_umow
    ADD CONSTRAINT typ_umow_pkey PRIMARY KEY (id);


--
-- Name: urlopy urlopy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.urlopy
    ADD CONSTRAINT urlopy_pkey PRIMARY KEY (id);


--
-- Name: benefity_pracownicy benefity_pracownicy_googleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.benefity_pracownicy
    ADD CONSTRAINT benefity_pracownicy_googleid_fkey FOREIGN KEY (googleid) REFERENCES public.pracownicy(googleid);


--
-- Name: benefity_pracownicy benefity_pracownicy_id_benefitu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.benefity_pracownicy
    ADD CONSTRAINT benefity_pracownicy_id_benefitu_fkey FOREIGN KEY (id_benefitu) REFERENCES public.benefity(id);


--
-- Name: dostepnosc dostepnosc_googleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dostepnosc
    ADD CONSTRAINT dostepnosc_googleid_fkey FOREIGN KEY (googleid) REFERENCES public.pracownicy(googleid);


--
-- Name: nieobecnosci fk_nieobecnosci_pracownicy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nieobecnosci
    ADD CONSTRAINT fk_nieobecnosci_pracownicy FOREIGN KEY (googleid) REFERENCES public.pracownicy(googleid);


--
-- Name: pracownicy fk_pracownicy_stanowisko; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pracownicy
    ADD CONSTRAINT fk_pracownicy_stanowisko FOREIGN KEY (stanowisko) REFERENCES public.stanowiska(id);


--
-- Name: pracownicy fk_pracownicy_typ_umowy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pracownicy
    ADD CONSTRAINT fk_pracownicy_typ_umowy FOREIGN KEY (typ_umowy) REFERENCES public.typ_umow(id);


--
-- Name: urlopy fk_urlopy_pracownicy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.urlopy
    ADD CONSTRAINT fk_urlopy_pracownicy FOREIGN KEY (googleid) REFERENCES public.pracownicy(googleid);


--
-- Name: kompetencje_pracownicy kompetencje_pracownicy_googleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kompetencje_pracownicy
    ADD CONSTRAINT kompetencje_pracownicy_googleid_fkey FOREIGN KEY (googleid) REFERENCES public.pracownicy(googleid);


--
-- Name: kompetencje_pracownicy kompetencje_pracownicy_kompetencje_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kompetencje_pracownicy
    ADD CONSTRAINT kompetencje_pracownicy_kompetencje_fkey FOREIGN KEY (kompetencje) REFERENCES public.kompetencje(id);


--
-- Name: szkolenia_pracownicy szkolenia_pracownicy_googleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.szkolenia_pracownicy
    ADD CONSTRAINT szkolenia_pracownicy_googleid_fkey FOREIGN KEY (googleid) REFERENCES public.pracownicy(googleid);


--
-- Name: szkolenia_pracownicy szkolenia_pracownicy_id_szkolenia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.szkolenia_pracownicy
    ADD CONSTRAINT szkolenia_pracownicy_id_szkolenia_fkey FOREIGN KEY (id_szkolenia) REFERENCES public.szkolenia(id);


--
-- PostgreSQL database dump complete
--

