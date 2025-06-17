"use client";

import Link from "next/link";
import React, { useState } from "react";
import SubmissionForm from "./SubmissionForm";

const Nav = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex justify-between items-center p-4 bg-[#F2E9E4] text-[#96627f] shadow-md">
        <Link
          href={"/"}
          className="p-1 rounded-md hover:p-2 hover:bg-[#96627f] hover:text-[#F2E9E4] transition-all duration-200"
        >
          Home
        </Link>
        <Link
          href={"/blog"}
          className="p-1 rounded-md hover:p-2 hover:bg-[#96627f] hover:text-[#F2E9E4] transition-all duration-200"
        >
          Blogs
        </Link>
        <button
          className="p-1 rounded-md hover:p-2 hover:bg-[#96627f] hover:text-[#F2E9E4] transition-all duration-200 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          Create
        </button>
      </nav>

      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Blog Post</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <SubmissionForm onSuccess={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
