import React, { useEffect, useState } from "react";
import { AnimatePresence, delay, easeInOut, motion } from "framer-motion";
import { FadeInOutWithOpacity, scaleInOut } from "../animations";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";
import { saveToCollections, saveToFavourites } from "../api";
import { useNavigate } from "react-router-dom";

const TemplateDesignPin = ({ data, index }) => {
  const { data: user, refetch: userRefetch } = useUser();
  const { refetch: temp_refetch } = useTemplates();
  const [isHoverred, setIsHoverred] = useState(false);
  const navigate = useNavigate();

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    temp_refetch();
  };
  const handleRouteNavigation = () => {
    navigate(`/resumeDetail/${data?._id}`, { replace: true });
  };
  return (
    <motion.div key={data?.id} {...scaleInOut(index)}>
      <div
        onMouseEnter={() => setIsHoverred(true)}
        onMouseLeave={() => setIsHoverred(false)}
        className="w-full h-[500px] 2xl:h-[500px] rounded-md bg-gray-200 overflow-hidden relative"
      >
        <img
          src={data?.imageURL}
          className="w-full h-full object-cover"
          alt=""
        />
        <AnimatePresence>
          {isHoverred && (
            <motion.div
              onClick={handleRouteNavigation}
              {...FadeInOutWithOpacity}
              className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer"
            >
              <div className="flex flex-col items-end justify-start w-full gap-8">
                <InnerBoxCard
                  label={
                    user?.collections?.includes(data?._id)
                      ? "Added to Collections"
                      : "Add to Collections"
                  }
                  Icon={
                    user?.collections?.includes(data?._id)
                      ? BiSolidFolderPlus
                      : BiFolderPlus
                  }
                  OnHandle={addToCollection}
                />
                <InnerBoxCard
                  label={
                    data?.favourites?.includes(user?.uid)
                      ? "Added To Favourites"
                      : "Add to Favourites"
                  }
                  Icon={
                    data?.favourites?.includes(user?.uid)
                      ? BiSolidHeart
                      : BiHeart
                  }
                  OnHandle={addToFavourites}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxCard = ({ label, Icon, OnHandle }) => {
  const [isHoverred, setIsHoverred] = useState(false);
  return (
    <div
      onClick={OnHandle}
      className="w-10 h-10 rounded-md bg-gray-200  flex items-center justify-center hover:shadow-md relative"
      onMouseEnter={() => setIsHoverred(true)}
      onMouseLeave={() => setIsHoverred(false)}
    >
      <Icon className=" text-txtPrimary text-base" />
      <AnimatePresence>
        {isHoverred && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 50 }}
            className="px-3 py-2 rounded-md bg-gray-200 absolute -left-44 after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[14px] after:rotate-45"
          >
            <p className="text-sm text-txtPrimary whitespace-nowrap  ">
              {label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesignPin;
