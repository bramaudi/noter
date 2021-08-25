--
-- Name: notes; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.notes (
    id bigint NOT NULL,
    title text,
    body text NOT NULL,
    tags character varying[],
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    user_id uuid NOT NULL,
    color character varying
);

--
-- Name: COLUMN notes.body; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.notes.body IS 'Notes content body';


--
-- Name: COLUMN notes.tags; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.notes.tags IS 'Notes tags for more organized';


--
-- Name: COLUMN notes.color; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.notes.color IS 'Note background color';
