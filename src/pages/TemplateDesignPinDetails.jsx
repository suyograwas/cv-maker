import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import {
  getTemplateDetails,
  saveToCollections,
  saveToFavourites,
} from "../api";
import { MainSpinner } from "../components";
import { FaHome } from "react-icons/fa";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";
import { AnimatePresence, motion } from "framer-motion";
import { TemplateDesignPin } from "../components";

const TemplateDesignPinDetails = () => {
  const { templateID } = useParams();

  const { data, isError, isLoading, refetch } = useQuery(
    ["template", templateID],
    () => getTemplateDetails(templateID)
  );
  const { data: user, refetch: userRefetch } = useUser();
  const {
    data: templates,
    refetch: temp_refetch,
    isLoading: temp_isLoading,
  } = useTemplates();

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    temp_refetch();
    refetch();
  };

  if (isLoading) return <MainSpinner />;
  if (isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-txtPrimary font-semibold">
          Error while fetching the data .... Please try agin later
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-start flex-col px-14 py-12">
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHome /> Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>

      {/* design main section layout  */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12">
        {/* left section  */}
        <div className="col-span-1 lg:col-span-8 flex flex-col  items-start justify-start gap-4">
          {/* load the template image  */}
          <img
            src={data?.imageURL}
            className="w-full h-auto object-contain rounded-md"
          />

          {/* title and other options  */}
          <div className="w-full flex flex-col items-start justify-start gap-2">
            {/* title section  */}
            <div className="w-full flex items-center  justify-between ">
              {/* display title  */}
              <p className="text-base text-txtPrimary font-semibold">
                {data?.title}
              </p>
              {/* likes count  */}
              {data?.favourites?.length > 0 && (
                <div className="flex items-center justify-center gap-1">
                  <BiSolidHeart className="text-base text-red-500" />
                  <p className="text-base text-txtPrimary font-semibold">
                    {data?.favourites?.length} likes
                  </p>
                </div>
              )}
            </div>

            {/* collection favourite options */}
            {user && (
              <div className="flex items-center justify-center gap-3">
                {user?.collections?.includes(data?._id) ? (
                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiSolidFolderPlus className="text-base text-txtPrimary " />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Remove From Collection
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiFolderPlus className="text-base text-txtPrimary " />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Add To Collection
                      </p>
                    </div>
                  </React.Fragment>
                )}

                {data?.favourites?.includes(user?.uid) ? (
                  <React.Fragment>
                    <div
                      onClick={addToFavourites}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiSolidHeart className="text-base text-txtPrimary " />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Remove From Favourites
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div
                      onClick={addToFavourites}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiHeart className="text-base text-txtPrimary " />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Add To Favourites
                      </p>
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </div>

        {/* right section */}
        <div className=" col-span-1 lg:col-span-4 w-full flex flex-col items-center justify-start px-3 gap-6">
          {/* Discover More  */}
          <div
            className="w-full h-72 bg-blue-200 rounded-md overflow-hidden relative"
            style={{
              background:
                "url(https://img.freepik.com/free-photo/natures-beauty-captured-colorful-flower-close-up-generative-ai_188544-8593.jpg?size=626&ext=jpg&ga=GA1.1.87170709.1707350400&semt=sph)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
              <Link
                to="/"
                className=" px-4 py-2 rounded-md border-2 border-gray-50 text-white"
              >
                Discover More
              </Link>
            </div>
          </div>

          {/* edit the template  */}
          {user && (
            <Link
              to={`/resume/${data?.name}?templateId=${templateID}`}
              className="w-full px-4 py-3  rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer"
            >
              <p className="text-white font-semibold text-lg ">
                Edit This Template
              </p>
            </Link>
          )}
          {/* tags  */}
          <div className="w-full flex items-center justify-start flex-wrap gap-2 ">
            {data?.tags?.map((tag, index) => (
              <p
                className="text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap"
                key={index}
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* similar templates  */}
      {templates?.filter((temp) => temp._id !== data?._id)?.length > 0 && (
        <div className="w-full py-8 flex flex-col items-start justify-normal gap-4">
          <p className="text-lg font-semibold text-txtDark">
            You might also like{" "}
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <React.Fragment>
              <AnimatePresence>
                {templates
                  ?.filter((temp) => temp._id !== data?._id)
                  .map((template, index) => (
                    <TemplateDesignPin
                      key={template?._id}
                      data={template}
                      index={index}
                    />
                  ))}
              </AnimatePresence>
            </React.Fragment>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDesignPinDetails;
