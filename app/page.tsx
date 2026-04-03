"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Home() {
  const task = useQuery(api.tasks.getAllTasks);

  return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <main>
        <h1>All task in database</h1>
        {task?.length === 0 ? (
          <p>No task in database</p>
        ) : task === undefined ? (
          <p> Loading... </p>
        ) : (
          task.map((item) => (
            <div className="" key={item._id}>
              <div className="">
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
            </div>
          ))
        )}
      </main>
    </div>
  );
}
