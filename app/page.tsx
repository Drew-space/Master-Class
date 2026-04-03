"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Home() {
  const task = useQuery(api.tasks.getAllTasks);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>All task in database</h1>
        {task?.length === 0 ? (
          <p>No task in database</p>
        ) : task === undefined ? (
          <p> Loading... </p>
        ) : (
          task.map((item) => (
            <div className="flex justify-between items-center" key={item._id}>
              <p>{item.text}</p>
              <p>
                {" "}
                is completed:{" "}
                {item.isCompleted ? (
                  <span className="bg-green-500 text-white">Yes</span>
                ) : (
                  <span className="bg-red-500 text-white">No</span>
                )}
              </p>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
