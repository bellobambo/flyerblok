"use client";

import Link from "next/link";
import React, { useState } from "react";
import SubmissionForm from "./SubmissionForm";
import { motion, AnimatePresence } from "framer-motion";

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
          Drop a Gem 💎
        </button>
      </nav>

      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50">
          <AnimatePresence>
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-[#F2E9E4] p-6 rounded-lg max-w-md w-full shadow-lg"
            >
              <div className="flex justify-between items-center mb-4  border-b-[#b4869f] p-2 rounded-md shadow-lg">
                <h2 className="text-xl font-semibold text-[#ae7796]">
                  {" "}
                  <em>New Flyer</em>
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#b4869f] cursor-pointer hover:text-[#b4869f] text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <SubmissionForm onSuccess={() => setShowModal(false)} />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default Nav;
