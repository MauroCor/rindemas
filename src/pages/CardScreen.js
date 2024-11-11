// import React, { useEffect, useState } from 'react';
// import CarouselComponent from '../components/CarouselComponent';
// import ButtonComponent from '../components/ButtonComponent';
// import DropdownItemsPerPageComponent from '../components/DropdownItemsPerPageComponent';
// import FixedDataComponent from '../components/FixedDataComponent';
// import { Link } from 'react-router-dom';
// import getIncomes from '../services/income';
// import getFixedCosts from '../services/fixedCost';

// const CardScreen = () => {
//   const [dataMonths, setDataMonths] = useState([]);
//   const [itemsPerPages, setItemsPerPages] = useState(3);
//   const [currentsMonths, setCurrentsMonths] = useState([]);
//   const [startIndex, setStartIndex] = useState(0);

//   useEffect(() => {
//     const fetchAndMergeData = async () => {
//       try {
//         const incomes = await getIncomes();
//         const fixedCosts = await getFixedCosts();

//         // Combine income and fixed costs by matching on the date
//         const mergedData = incomes.map((incomeMonth) => {
//           const matchingFixedCost = fixedCosts.find((cost) => cost.date === incomeMonth.date) || { fixedCost: [], total: 0 };

//           return {
//             date: incomeMonth.date,
//             income: {
//               items: incomeMonth.income,
//               total: incomeMonth.total,
//             },
//             fixedCost: {
//               items: matchingFixedCost.fixedCost,
//               total: matchingFixedCost.total,
//             },
//           };
//         });

//         setDataMonths(mergedData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchAndMergeData();
//   }, []);

//   useEffect(() => {
//     setCurrentsMonths(dataMonths.slice(startIndex, startIndex + itemsPerPages));
//   }, [dataMonths, startIndex, itemsPerPages]);

//   const handlePrev = () => {
//     setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPages, 0));
//   };

//   const handleNext = () => {
//     setStartIndex((prevIndex) => {
//       const newIndex = prevIndex + itemsPerPages;
//       return newIndex >= dataMonths.length ? Math.max(0, dataMonths.length - itemsPerPages) : newIndex;
//     });
//   };

//   const handleItemsPerPageChange = (newItemsPerPage) => {
//     setItemsPerPages(newItemsPerPage);
//     setStartIndex(0);
//   };

//   const focusCurrentMonth = () => {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();

//     const currentIndex = dataMonths.findIndex((month) => {
//       const monthDate = new Date(month.date);
//       return monthDate.getFullYear() === currentYear && monthDate.getMonth() === currentMonth;
//     });

//     if (currentIndex !== -1) {
//       const adjustedIndex = Math.floor(currentIndex / itemsPerPages) * itemsPerPages;
//       setStartIndex(adjustedIndex);
//     }
//   };

//   return (
//     <div className="dark bg-gray-900 min-h-screen">
//       <div className="relative p-1">
//         <div className="text-center">
//           <Link className="bg-gradient-to-br from-[#4b76c8] to-[#1f4691] rounded-[45px] text-[15px] p-[10px] border-4 border-[#252525] shadow-[ -6px_-5px_18px_rgba(255,255,255,0.1)] cursor-pointer" to="/agregar">+ Agregar</Link>
//         </div>
//         <div className='flex justify-center items-center flex-wrap space-x-2 mt-6'>
//           <ButtonComponent text="⬅️" onClick={handlePrev} />
//           <div className='pl-16' />
//           <ButtonComponent text="Ver actual" onClick={focusCurrentMonth} />
//           <DropdownItemsPerPageComponent itemsPerPage={itemsPerPages} onItemsPerPageChange={handleItemsPerPageChange} />
//           <div className='pl-16' />
//           <ButtonComponent text="➡️" onClick={handleNext} />
//         </div>
//         <CarouselComponent data={currentsMonths} renderItem={(monthData) => <FixedDataComponent monthData={monthData} />} />
//       </div>
//     </div>
//   );
// };

// export default CardScreen;
