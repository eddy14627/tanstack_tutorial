"use client";
import Image from "next/image";
import { useQuery, useIsFetching } from "@tanstack/react-query";

interface Todo {
  userId?: number;
  id: number;
  title: string;
  completed?: boolean;
}
export default function Home() {
  // REMEMBER: to know no. of query loading => if isFetching = 0 , signifies all queries are loaded
  // const isFetching = useIsFetching();

  // to know if query loading for specific query
  const isFetching2 = useIsFetching({
    queryKey: ["todos-list"], // REMEMBER: we can't use multiple query here queryKey: ["todos-list" , "user-details"],
  });

  // console.log(isFetching);
  // console.log(isFetching2);
  const { data, isLoading, isError, isSuccess } = useQuery<Todo[]>({
    queryKey: ["todos-list"],
    queryFn: async () =>
      fetch("https://jsonplaceholder.typicode.com/todos").then((res) =>
        res.json()
      ),
    select: (item) => {
      return item.map((todo) => ({ id: todo.id, title: todo.title }));
    },
  });

  const { data: userData } = useQuery<any>({
    queryKey: ["user-details"],
    queryFn: async () => {
      return fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
        res.json()
      );
    },
    enabled: !!data,
  });
  // console.log(data);
  if (isLoading) {
    return <div className="text-lg">Loading...</div>;
  }
  if (isError) {
    return <div className="text-lg">error</div>;
  }
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1>Todo List</h1>
        {data?.slice(0, 5).map((item: Todo) => {
          return (
            <div>
              <div>{item.title}</div>
            </div>
          );
        })}
      </div>
      <div>
        <h1>user List</h1>
        {userData?.map((item: any) => {
          return (
            <div>
              <div>{item.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
