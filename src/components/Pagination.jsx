import { GrFormNext } from "react-icons/gr";

const Pagination = ({ currentPage, totalItems,filteredItems, itemsPerPage, paginate }) => {
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  if (pageCount <= 1) return null;

  return (
    
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
    <div className="mt-6 flex justify-center items-center pb-8">
      <button
         onClick={() => paginate(currentPage - 1)}
         disabled={currentPage === 1 || pageCount === 1}
         className="mx-1 px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
         aria-label="Previous Page"
      >
        <GrFormNext className="transform rotate-180" />
      </button>
      {/* ... (lógica de renderizado de números de página) ... */}
      {(() => {
            const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
            const pageNumbers = [];

            for (let i = 1; i <= pageCount; i++) {
              if (
                i === 1 ||
                i === pageCount ||
                (i >= currentPage - 1 && i <= currentPage + 1)
              ) {
                pageNumbers.push(
                  <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`mx-1 px-4 py-2 rounded-full ${currentPage === i
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } transition-colors duration-200`}
                  >
                    {i}
                  </button>
                );
              } else if (
                (i === currentPage - 2 && currentPage > 3) ||
                (i === currentPage + 2 && currentPage < pageCount - 2)
              ) {
                pageNumbers.push(
                  <span key={`ellipsis-${i}`} className="mx-1">
                    {/* <GrFormNext /> */}
                  </span>
                );
              }
            }
            return pageNumbers;
          })()}
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === pageCount || pageCount === 1}
        className="mx-1 px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
        aria-label="Next Page"
      >
        <GrFormNext />
      </button>
    </div>
    </div>
  );
};

export default Pagination;