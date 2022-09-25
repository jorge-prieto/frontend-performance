import axios from "axios";

export const getPerformanceScore = async (url: any) => {
  const res = await axios.get(url);
  return res.data;
};
