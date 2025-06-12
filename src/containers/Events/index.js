import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";
import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filtrage par type
  const filteredEvents =
    (!type
      ? data?.events
      : data?.events?.filter((event) => event.type === type)) || [];

  // 2. Pagination sur la liste filtrée
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  // 3. Calcul du nombre de pages
  const pageNumber = Math.ceil(filteredEvents.length / PER_PAGE);

  // 4. Liste des types pour le Select
  const typeList = new Set(data?.events?.map((event) => event.type));

  // 5. Remettre la page à 1 quand on change de filtre
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) =>
                  event.cover &&
                  event.title &&
                  event.date &&
                  event.type && (
                    <EventCard
                      onClick={() => setIsOpened(true)}
                      imageSrc={event.cover}
                      title={event.title}
                      date={new Date(event.date)}
                      label={event.type}
                    />
                  )
                }
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {Array.from({ length: pageNumber }, (_, n) => (
              <a
                key={n + 1}
                href="#events"
                onClick={() => setCurrentPage(n + 1)}
              >
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
