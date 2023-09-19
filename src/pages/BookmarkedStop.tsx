import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import AppContext from "../AppContext";
import { Paper, SxProps, Theme } from "@mui/material";
import BadWeatherCard from "../components/layout/BadWeatherCard";
import DbRenewReminder from "../components/layout/DbRenewReminder";
import StopTabbar from "../components/bookmarked-stop/StopTabbar";
import StopRouteList from "../components/bookmarked-stop/StopRouteList";

const BookmarkedStop = () => {
  const {
    savedStops,
    db: { stopList, stopMap },
    colorMode,
  } = useContext(AppContext);
  const defaultTab = useMemo(() => {
    try {
      const cached = localStorage.getItem("stopTab") ?? "|";
      if (
        cached &&
        savedStops.includes(cached) &&
        stopList[cached.split("|")[1]]
      ) {
        return cached;
      }
      for (let i = 0; i < savedStops.length; ++i) {
        let stopId = savedStops[i].split("|")[1];
        if (stopList[stopId]) return savedStops[i];
      }
    } catch {
      return "";
    }
  }, [savedStops, stopList]);
  const [stopTab, setStopTab] = useState<string>(defaultTab);

  const stops = useMemo(() => {
    if (stopTab === "") return undefined;
    const ret = [stopTab.split("|")];
    stopMap[ret[0][1]]?.forEach((v) => ret.push(v));
    return ret;
  }, [stopTab, stopMap]);

  const bgColor = useCallback(
    (theme: Theme) => {
      if (stopTab === "") return "unset";
      return theme.palette.mode === "dark"
        ? theme.palette.background.default
        : "white";
    },
    [stopTab]
  );

  useEffect(() => {
    console.log("hi");
    localStorage.setItem("stopTab", stopTab);
  }, [stopTab]);

  return (
    <Paper
      sx={{
        ...paperSx,
        bgcolor: bgColor,
        backgroundImage:
          stopTab === ""
            ? `url(/stop-bookmark-guide-${colorMode}.png)`
            : "unset",
        opacity: stopTab === "" ? "0.8" : "unset",
      }}
      square
      elevation={0}
    >
      <StopTabbar
        stopTab={stopTab}
        onChangeTab={(v: string) => setStopTab(v)}
      />
      <BadWeatherCard />
      <DbRenewReminder />
      <StopRouteList stops={stops} />
    </Paper>
  );
};

export default BookmarkedStop;

const paperSx: SxProps<Theme> = {
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  width: "100%",
  flex: 1,
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};
