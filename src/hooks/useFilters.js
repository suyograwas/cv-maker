import { useQuery } from "react-query";

const useFilters = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "globalFilter",
    () => ({
      searchTerm: "",
    }),
    {
      refetchOnWindowFocus: false,
    }
  );
  return { data, isError, isLoading, refetch };
};

export default useFilters;
