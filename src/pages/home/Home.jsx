import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../requestMethods";

//Represents homepage of the application, displaying user analytics using FeaturedInfo and Chart components

export default function Home() {
  const [userStats, setUserStats] = useState([]);

  const MONTHS = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get("/users/stats");
        res.data.map((item) =>
          setUserStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], "Active User": item.total },
          ])
        );
      } catch {}
    };
    getStats();
  }, [MONTHS]);

  return (
    <div className="home">
      <FeaturedInfo />
      <Chart
        data={userStats}
        title="User Analytics"
        grid
        dataKey="Active User"
      />
    </div>
  );
}