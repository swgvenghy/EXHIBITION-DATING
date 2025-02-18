import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const signUp = async ({
  id,
  name,
  gender,
}: {
  id: number;
  name: string;
  gender: string;
}) => {
  const { data, error } = await supabase
    .from("users")
    .insert([{ id: id, name: name, gender: gender }])
    .select();

  if (error) throw error;
  return data;
};

export const signUpProfile = async ({
  userId,
  nickname,
  mbti,
  description,
  instaProfile,
}: {
  userId: number;
  nickname: string;
  mbti: string;
  description: string;
  instaProfile: string;
}) => {
  const { data, error } = await supabase
    .from("profile")
    .insert([
      {
        user_id: userId,
        nickname: nickname,
        mbti: mbti,
        description: description,
        insta_profile: instaProfile,
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

export const login = async ({ id, name }: { id: number; name: string }) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, gender, check_num")
    .eq("id", id)
    .eq("name", name);
  if (error) throw error;
  return data;
};

export interface ProfileProps {
  nickname: string;
  mbti: string;
  description: string;
  insta_profile: string;
}

export const getAllPropfile = async ({
  startPage,
  endPage,
}: {
  startPage: number;
  endPage: number;
}) => {
  const { data, error } = await supabase
    .from("profile")
    .select("nickname, mbti, description, insta_profile")
    .range(startPage, endPage);

  if (error || null) throw error;
  return data as unknown as ProfileProps[];
};

export const matchingUpdate = async ({
  userId,
  targetId,
  checkNum,
}: {
  userId: number;
  targetId: number;
  checkNum: number;
}) => {
  const { data, error } = await supabase
    .from("matching")
    .insert([{ user_id: userId, target_user_id: targetId }])
    .select();

  const { data: userData, error: userError } = await supabase
    .from("users")
    .update({ check_num: checkNum })
    .eq("id", userId)
    .select();

  if (error || userError) throw error || userError;

  return { data, userData };
};

export const getMatchesWithProfile = async (userId: string) => {
  const { data: matches, error } = await supabase
    .from("matching")
    .select("target_user_id")
    .eq("user_id", userId);

  if (error) throw error;

  const profiles = await Promise.all(
    matches.map(async (match: { target_user_id: string }) => {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", match.target_user_id)
        .single();
      if (error) throw error;
      return data;
    })
  );

  return profiles;
};
