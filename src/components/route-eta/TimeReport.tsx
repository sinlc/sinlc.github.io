import React, { useContext, useMemo } from "react";
import { Box, SxProps, Theme, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import AppContext from "../../AppContext";
import { useEtas } from "../../hooks/useEtas";
import { LinearProgress } from "../Progress";
import { Eta, Terminal } from "hk-bus-eta";
import { PLATFORM, getLineColor } from "../../utils";

interface TimeReportProps {
  routeId: string;
  seq: number;
  containerSx?: SxProps<Theme>;
  showStopName?: boolean;
}

const TimeReport = ({
  routeId,
  seq,
  containerSx,
  showStopName = false,
}: TimeReportProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const {
    db: { routeList, stopList },
  } = useContext(AppContext);
  const etas = useEtas(`${routeId}/${seq}`);

  const { route, co, stops } = routeList[routeId];
  const stopId = Object.values(stops)[0][seq];
  const routeDests = useMemo(
    () =>
      Object.values(routeList[routeId].stops)
        .map((ids) => stopList[ids[ids.length - 1]].name)
        .concat(routeList[routeId].dest),
    [routeList, routeId, stopList]
  );

  let isEndOfTrainLine = false;
  if (co[0] === "mtr") {
    isEndOfTrainLine = stops["mtr"].indexOf(stopId) + 1 >= stops["mtr"].length;
  } else if (co.includes("lightRail")) {
    isEndOfTrainLine = stops["lightRail"].indexOf(stopId) + 1 >= stops["lightRail"].length;
  }

  if (etas == null) {
    return (
      <Box sx={containerSx}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={containerSx}>
      {showStopName && (
        <Typography variant="caption">
          {stopList[stopId].name[language]}
        </Typography>
      )}
      {isEndOfTrainLine && etas.length === 0 && t("終點站")}
      {!isEndOfTrainLine && etas.length === 0 && t("未有班次資料")}
      {etas.length > 0 &&
        etas.map((eta, idx) => (
          <EtaLine
            key={`route-${idx}`}
            eta={eta}
            routeDests={routeDests}
            showCompany={co.length > 1}
            route={route}
          />
        ))}
    </Box>
  );
};

interface EtaMsgProps {
  eta: Eta;
  routeDests: Terminal[];
  showCompany: boolean;
  route: string;
}

const EtaLine = ({
  eta: { eta, remark, co, dest },
  routeDests,
  showCompany,
  route,
}: EtaMsgProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { etaFormat } = useContext(AppContext);

  const branchRoute = useMemo(() => {
    if (co === "mtr") {
      return true;
    }
    for (const routeDest of routeDests) {
      if (routeDest.en.toLowerCase() === dest.en.toLowerCase()) {
        return false;
      }
      if (routeDest.zh === dest.zh) {
        return false;
      }
    }
    return true;
  }, [routeDests, dest, co]);

  const waitTime = Math.round(
    (new Date(eta).getTime() - new Date().getTime()) / 60 / 1000
  );

  const exactTimeJsx = (
    <Box
      component="span"
      sx={etaFormat !== "exact" ? { fontSize: "0.9em" } : {}}
    >
      {eta.slice(11, 16)}
    </Box>
  );
  const waitTimeJsx = (
    <Box component="span">
      <Box
        component="span"
        sx={{ ...waitTimeSx, color: (theme) => theme.palette.warning.main }}
      >
        {waitTime < 1 ? " - " : `${waitTime} `}
      </Box>
      <Box component="span" sx={{ fontSize: "0.8em" }}>
        {t("分鐘")}
      </Box>
    </Box>
  );

  return (
    <Typography variant="subtitle1">
      {etaFormat === "diff" && waitTimeJsx}
      {etaFormat === "exact" && exactTimeJsx}
      {etaFormat === "mixed" && (
        <>
          {exactTimeJsx}&emsp;{waitTimeJsx}
        </>
      )}
      {co !== "mtr" && co !== "lightRail" && "&emsp;-&nbsp;"}
      <Box
        component="span"
        sx={{ fontSize: "0.8em", textOverflow: "ellipsis" }}
      >
        {showCompany && <>&emsp;{t(co)}</>}
        &emsp;
        {co === "mtr" || co === "lightRail" ?
        <Box component="span" color={getLineColor([co], route, true)}>{getRemark(remark[language], language)}</Box> : 
        getRemark(remark[language], language)}
        {co === "mtr" || co === "lightRail" ? " " : "&emsp;"}
        {branchRoute && dest[language]}
      </Box>
    </Typography>
  );
};

const getRemark = (remark: string | null, language: string) => {
  if (remark === null) return "";
  // retrieve single digit numerical string from remark as a circle text
  const platform =
    [
      ...remark.matchAll(
        language === "zh" ? /(\d+)號月台/g : /Platform (\d+)/g
      ),
    ][0] || [];

  // replace only when single occurrence of single digit numerical string
  // if the remark has more than one occurrence of numerical string
  // or if the only numerical string occurrence are more than one digit, use original remark
  if (platform.length === 2 && platform[1].length) {
    // only support single digit number
    remark = PLATFORM[platform[1]];
  }

  if (language === "zh") {
    return remark.replace(/▭▭/g, "雙卡").replace(/▭/g, "單卡");
  } else {
    return remark.replace(/▭▭/g, "Duel").replace(/▭/g, "Single");
  }
};

export default TimeReport;

const waitTimeSx: SxProps<Theme> = {
  fontWeight: "700",
  color: "#088bce",
};
