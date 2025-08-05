'use client';

import { User } from '@supabase/supabase-js';
import { atom } from 'jotai';

const userAtom = atom<User>();

export default userAtom;
