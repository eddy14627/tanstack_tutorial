"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
const page = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newTodo: any) => {
      return axios.post("http://localhost:8000/todos", newTodo);
    },
    onMutate: (variable: any) => {
      console.log("variable : ", variable, "mutation is about to happen");
    },
    onError: (error, variable, context) => {
      console.log("error : ", error);
    },
    onSuccess: (data, variable, context) => {
      console.log("success : ", data);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onSettled: (res: any) => {
      console.log("settled : ", res);
    },
  });

  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      return fetch("http://localhost:8000/todos").then((res: any) =>
        res.json()
      );
    },
  });

  console.log(todos);

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      {mutation.isPending ? (
        "....loading"
      ) : (
        <>
          {mutation.isError ? (
            <div>Error occured</div>
          ) : (
            <div>
              <button
                onClick={() => {
                  mutation.mutate({ id: new Date(), title: "do laundry" });
                }}
              >
                create todo
              </button>
            </div>
          )}
        </>
      )}
      <div className="flex flex-col items-center">
        <h1>Todo List</h1>
        {todos?.map((item: any) => {
          return (
            <div>
              <div>{item.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
