'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image'; // Importação do Image do Next.js

const DJs = [
  { id: 1, name: 'DJ Raphael Leffras', image: '/img/dj-raphael-leffras.jpg', bioLink: '/dj/raphael-leffras' },
  { id: 2, name: 'DJ Matheus', image: '/img/dj-matheus.jpg', bioLink: '/dj/matheus' },
];

const DJSlider = () => {
  return (
    <motion.div
      className="flex justify-center flex-wrap gap-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {DJs.map((dj) => (
        <motion.div
          key={dj.id}
          className="bg-gray-900 shadow-lg rounded-lg p-6 flex flex-col items-center hover:scale-105 transition-transform"
          whileHover={{ scale: 1.1 }}
        >
          <Link href={dj.bioLink}>
            <div className="flex flex-col items-center">
              {/* Contêiner para o componente Image */}
              <div className="w-32 h-32 relative rounded-full border-4 border-orange-500 cursor-pointer hover:opacity-80 transition-opacity">
                <Image
                  src={dj.image}
                  alt={dj.name}
                  fill
                  className="object-cover rounded-full"
                  sizes="(max-width: 768px) 128px, 128px"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4 text-center">{dj.name}</h3>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DJSlider;
