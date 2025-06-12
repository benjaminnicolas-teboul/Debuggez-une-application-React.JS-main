import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Préparation d'une copie triée et enrichie d'un id unique si besoin
  const byDateAsc = (data?.focus || [])
    .slice()
    .sort((evtA, evtB) => new Date(evtA.date) - new Date(evtB.date))
    .map((event) => ({
      ...event,
      // Génère un id unique si absent (à partir du titre et de la date)
      id:
        event.id ||
        (event.title && event.date
          ? `${event.title}-${event.date}`
          : JSON.stringify(event)),
    }));

  const nextCard = () =>
    setTimeout(
      () => setIndex((prev) => (prev < byDateAsc.length - 1 ? prev + 1 : 0)),
      5000
    );

  useEffect(() => {
    const timer = nextCard();
    return () => clearTimeout(timer);
  }, [index, byDateAsc.length]);

  return (
    <div className="SlideCardList">
      {byDateAsc.map((event, idx) => (
        <div
          key={event.id}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt={event.title} />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>
                {(() => {
                  const dateObj = new Date(event.date);
                  const day = dateObj.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                  });
                  const month = dateObj.toLocaleDateString("fr-FR", {
                    month: "long",
                  }).toLowerCase();
                  const year = dateObj.toLocaleDateString("fr-FR", {
                    year: "numeric",
                  });
                  return (
                    <div>
                      {day}{month}{year}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateAsc.map((paginationEvent) => (
                <input
                  key={`pagination-${event.id}-to-${paginationEvent.id}`}
                  type="radio"
                  name={`radio-slider-${event.id}`}
                  checked={
                    index ===
                    byDateAsc.findIndex((e) => e.id === paginationEvent.id)
                  }
                  readOnly
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
