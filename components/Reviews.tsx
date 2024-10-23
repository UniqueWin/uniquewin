import { Star } from "lucide-react";

type Props = {};

function Reviews({}: Props) {
  return (
    <section className="bg-white p-4 md:p-10 md:my-10 text-black">
      <div className="container flex flex-col gap-4 mb-6">
        <h3 className="text-3xl font-bold">Reviews</h3>
        <p className="text-lg">Read what our players have to say about us.</p>
      </div>
      <div className="relative w-full overflow-hidden container">
        <div className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scroll-pl-4 scrollbar scrollbar-hide">
          <div className="w-64 flex-shrink-0 snap-start shadow-[0_0_5px_rgba(0,_0,_0,_0.1)] rounded-lg">
            <div className="bg-[#00b67a bg-white text-black p-4 rounded-lg h-full flex flex-col">
              <div className="flex flex-col justify-center items-center mb-2">
                <div className=" font-bold">Excellent</div>
                <div className="flex items-center gap-1 p-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-8 h-8 fill-white bg-green-500 p-1 outline-none stroke-white"
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm flex-grow">
                Ranked on <span className="font-bold">438 reviews</span>
              </p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Star className="w-6 h-6 fill-green-500 outline-none stroke-green-500" />
                <span className="text-xs ">Trustpilot</span>
              </div>
            </div>
          </div>

          {/* Other review items */}
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="w-64 flex-shrink-0 snap-start shadow-[0_0_5px_rgba(0,_0,_0,_0.1)] rounded-lg"
            >
              <div className="bg-[#00b67a bg-white text-black p-4 rounded-lg h-full flex flex-col gap-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-white bg-green-500 p-1 outline-none stroke-white"
                      />
                    ))}
                  </div>
                  <div className="text-xs">7 days ago</div>
                </div>
                <div className=" font-bold">Best on the market</div>
                <p className="text-sm  flex-grow">
                  "I love this product because it is the best on the market."
                </p>
                <hr className="w-20 my-1" />
                <span className="font-bold text-sm">Trustpilot</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reviews;
