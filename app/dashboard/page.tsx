/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import GroupMask from "@/public/groupmask.png";
import GroupMaskChart from "@/public/groupmaskchart.png";
import GroupMaskThreat from "@/public/groupmaskthreat.png";
import UpchartMini from "@/public/upchartmini.png";
import DownchartMini from "@/public/downchartmini.png";
import ModuleMask from "@/public/modulemask.png";
import EmpowerMask from "@/public/empowermask.png";
import Comprehensive from "@/public/comprehensive.png";
import Proactive from "@/public/proactive.png";
import Decision from "@/public/decision.png";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BASE_URL } from "@/utils/baseUrl";
import { Skeleton } from "@/components/ui/skeleton";

const MonitorLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 35 32"
      fill="none"
    >
      <path
        d="M19 12.5C19 13.3273 18.3273 14 17.5 14C16.6727 14 16 13.3273 16 12.5C16 11.6727 16.6727 11 17.5 11C18.3273 11 19 11.6727 19 12.5Z"
        fill="white"
      />
      <path
        d="M26.8586 12.0797C24.2165 8.61404 21.2428 7 17.5 7C13.7572 7 10.7835 8.61404 8.14138 12.0797C7.95287 12.3275 7.95287 12.6726 8.14138 12.9203C10.7835 16.386 13.7572 18 17.5 18C21.2428 18 24.2165 16.386 26.8586 12.9203C27.0471 12.6726 27.0471 12.3274 26.8586 12.0797ZM17.5 15.25C16.0033 15.25 14.7857 14.0164 14.7857 12.5C14.7857 10.9836 16.0033 9.75 17.5 9.75C18.9967 9.75 20.2143 10.9836 20.2143 12.5C20.2143 14.0164 18.9967 15.25 17.5 15.25Z"
        fill="white"
      />
      <path
        d="M32.2656 2.73438H2.73438C1.82968 2.73438 1.09375 3.46369 1.09375 4.36024V24.9546C1.09375 25.8511 1.82968 26.5804 2.73438 26.5804H12.335L11.9948 27.3391C11.6981 28.0007 12.1821 28.7483 12.9073 28.7483H22.0927C22.8178 28.7483 23.3019 28.0007 23.0051 27.3391L22.6649 26.5804H32.2656C33.1703 26.5804 33.9062 25.8511 33.9062 24.9546V4.36024C33.9062 3.46369 33.1703 2.73438 32.2656 2.73438ZM18.0469 24.1416C18.0469 24.2913 17.9245 24.4126 17.7734 24.4126H17.2266C17.0756 24.4126 16.9531 24.2913 16.9531 24.1416V23.5997C16.9531 23.45 17.0756 23.3287 17.2266 23.3287H17.7734C17.9245 23.3287 18.0469 23.45 18.0469 23.5997V24.1416ZM32.8125 21.1609H2.1875V4.36024C2.1875 4.06146 2.43288 3.81829 2.73438 3.81829H32.2656C32.5671 3.81829 32.8125 4.06146 32.8125 4.36024V21.1609Z"
        fill="white"
      />
    </svg>
  );
};

const ExclamationLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.032 4.19411C13.1059 2.68772 14.3234 1.59961 15.9996 1.59961C17.6759 1.59961 18.8934 2.68772 19.9671 4.19411C21.0305 5.68575 22.1578 7.88219 23.5823 10.6578L27.1551 17.6191C28.4073 20.0588 29.405 22.003 29.9393 23.569C30.4846 25.1673 30.6503 26.6619 29.8495 28.0129C29.0486 29.3638 27.6743 29.9074 26.0342 30.1561C24.4271 30.3996 22.2767 30.3996 19.5782 30.3996H12.421C9.72243 30.3996 7.57214 30.3996 5.96507 30.1561C4.32484 29.9074 2.95063 29.3638 2.14972 28.0129C1.34883 26.6619 1.51465 25.1673 2.05991 23.569C2.59415 22.003 3.59194 20.059 4.84415 17.6191L8.41692 10.6578C9.84142 7.88217 10.9687 5.68574 12.032 4.19411ZM17.1996 11.8996C17.1996 11.2369 16.6623 10.6996 15.9996 10.6996C15.3369 10.6996 14.7996 11.2369 14.7996 11.8996V18.2996C14.7996 18.9623 15.3369 19.4996 15.9996 19.4996C16.6623 19.4996 17.1996 18.9623 17.1996 18.2996V11.8996ZM15.9996 24.6996C16.8833 24.6996 17.5996 23.9833 17.5996 23.0996C17.5996 22.2159 16.8833 21.4996 15.9996 21.4996C15.1159 21.4996 14.3996 22.2159 14.3996 23.0996C14.3996 23.9833 15.1159 24.6996 15.9996 24.6996Z"
        fill="white"
      />
    </svg>
  );
};

// Define types for our API responses
interface AlertType {
  alert_type: string;
  count: number;
  percentage: number;
  total_count: number;
}

export default function ModuleOverview() {
  const [timeframe, setTimeframe] = useState("month");
  const [threatCount, setThreatCount] = useState(0);
  const [alertPercentages, setAlertPercentages] = useState<AlertType[]>([]);
  const [threatsTriggered, setThreatsTriggered] = useState(0);
  const [alertTimePeriod, setAlertTimePeriod] = useState("weekly");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingThreatCount, setIsLoadingThreatCount] = useState(true);
  const [isLoadingAlertTypes, setIsLoadingAlertTypes] = useState(true);
  const accessToken = localStorage.getItem("access_token");

  // Fetch threat count
  useEffect(() => {
    const fetchThreatCount = async () => {
      setIsLoadingThreatCount(true);
      try {
        const countResponse = await fetch(`${BASE_URL}/threat-count`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const countData = await countResponse.json();
        setThreatCount(countData.count);
      } catch (error) {
        console.error("Error fetching threat count:", error);
      } finally {
        setIsLoadingThreatCount(false);
      }
    };

    fetchThreatCount();
  }, []);

  // Fetch alert type percentages
  useEffect(() => {
    const fetchAlertPercentages = async () => {
      setIsLoadingAlertTypes(true);
      try {
        const percentagesResponse = await fetch(`${BASE_URL}/alert-types-percentage?time_period=${alertTimePeriod}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const percentagesData = await percentagesResponse.json();
        
        if (alertTimePeriod === 'all') {
          setAlertPercentages(percentagesData);
          // For "all" time period, use the total threat count
          setThreatsTriggered(threatCount);
        } else {
          // If we have time-based data, use the most recent period's data
          if (percentagesData.length > 0) {
            setAlertPercentages(percentagesData[0].alert_types);
            setThreatsTriggered(percentagesData[0].total_count);
          }
        }
      } catch (error) {
        console.error("Error fetching alert percentages:", error);
      } finally {
        setIsLoadingAlertTypes(false);
      }
    };

    fetchAlertPercentages();
  }, [alertTimePeriod, threatCount]);

  // Combined loading state for UI components that need both data
  useEffect(() => {
    setIsLoading(isLoadingThreatCount || isLoadingAlertTypes);
  }, [isLoadingThreatCount, isLoadingAlertTypes]);

  // Handle time period change for alert types
  const handleAlertTimePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlertTimePeriod(e.target.value);
  };

  // Monthly data (existing)
  const monthlyData = [
    { date: "1 Oct", akira: 200, fog: 100, funkSec: 0 },
    { date: "3 Oct", akira: 320, fog: 160, funkSec: 230 },
    { date: "7 Oct", akira: 190, fog: 95, funkSec: 420 },
    { date: "10 Oct", akira: 280, fog: 140, funkSec: 210 },
    { date: "14 Oct", akira: 470, fog: 350, funkSec: 240 },
    { date: "20 Oct", akira: 190, fog: 460, funkSec: 180 },
    { date: "23 Oct", akira: 60, fog: 350, funkSec: 280 },
    { date: "27 Oct", akira: 220, fog: 440, funkSec: 160 },
    { date: "30 Oct", akira: 460, fog: 240, funkSec: 400 },
  ];

  // Weekly data (new)
  const weeklyData = [
    { date: "Mon", akira: 150, fog: 80, funkSec: 120 },
    { date: "Tue", akira: 280, fog: 190, funkSec: 160 },
    { date: "Wed", akira: 310, fog: 230, funkSec: 290 },
    { date: "Thu", akira: 240, fog: 300, funkSec: 220 },
    { date: "Fri", akira: 390, fog: 270, funkSec: 180 },
    { date: "Sat", akira: 290, fog: 190, funkSec: 140 },
    { date: "Sun", akira: 210, fog: 160, funkSec: 110 },
  ];

  // Choose the right dataset based on timeframe
  const chartData = timeframe === "month" ? monthlyData : weeklyData;

  // Render skeleton for threat count
  const renderThreatCountSkeleton = () => (
    <>
      <Skeleton className="h-[40px] w-[120px] bg-[#2A2E3F] mb-2" />
      <div className="flex items-center gap-[2px]">
        <Skeleton className="h-[24px] w-[24px] bg-[#2A2E3F]" />
        <Skeleton className="h-[15px] w-[30px] bg-[#2A2E3F]" />
        <Skeleton className="h-[15px] w-[80px] bg-[#2A2E3F] ml-[5px]" />
      </div>
    </>
  );

  // Render skeleton for alert types
  const renderAlertTypesSkeleton = () => (
    <>
      <Skeleton className="h-[50px] w-[150px] bg-[#2A2E3F] mb-8" />
      {[1, 2, 3, 4, 5].map((_, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-6 h-6 rounded-full bg-[#2A2E3F] flex-shrink-0" />
            <Skeleton className="h-[20px] w-[80px] bg-[#2A2E3F]" />
            <Skeleton className="h-1.5 w-full bg-[#2A2E3F] rounded-full" />
            <Skeleton className="h-[20px] w-[30px] bg-[#2A2E3F]" />
          </div>
          <div className="border-b border-[#2A2E3F]"></div>
        </div>
      ))}
    </>
  );

  return (
    <div className="space-y-12">
      <section className="logistics flex flex-col lg:flex-row justify-between items-center gap-[20px]">
        <div className="threat-analytics w-full lg:w-[65%] flex flex-col gap-y-[20px]">
          <div className="group-threat flex justify-between items-center gap-[20px]">
            <div
              className="group_count h-[240px] xl:h-[200px] w-1/2 bg-[#111427] py-[15px] px-[20px]"
              style={{
                backgroundImage: `url(${GroupMask.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "26px",
                border: "1px solid #22263C",
              }}
            >
              <div className="flex justify-between items-center gap-[10px] mb-[20px]">
                <div className="monitor-logo p-[10px] w-[20%] bg-[#B435D4] rounded-[11px] flex justify-center items-center">
                  <MonitorLogo />
                </div>
                <div className="text-white w-[80%] text-[15px] xl:text-[18px] font-medium">
                  No of Groups & Channels Tracked
                </div>
              </div>
              <div className="flex justify-center items-center gap-[15px] w-full">
                <div className="w-[65%] flex flex-col justify-center">
                  <p className="text-[25px] xl:text-[30px] text-left font-[600] text-[#EBEBEB]">
                    12,483
                  </p>
                  <div className="flex items-center gap-[2px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M21.2134 6.80725L13.6261 14.3946C13.2443 14.7764 13.0534 14.9673 12.8332 15.0389C12.6395 15.1018 12.4309 15.1018 12.2373 15.0389C12.0171 14.9673 11.8262 14.7764 11.4443 14.3946L8.8049 11.7552C8.42305 11.3733 8.23212 11.1824 8.01195 11.1108C7.81829 11.0479 7.60968 11.0479 7.41601 11.1108C7.19585 11.1824 7.00492 11.3733 6.62306 11.7552L1.9285 16.4497M21.2134 6.80725H14.4637M21.2134 6.80725V13.557"
                        stroke="#17B26A"
                        stroke-width="2.31419"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p className="text-[12px] xl:text-[15px] text-left font-[600] text-[#17B26A]">
                      12.4%
                    </p>
                    <p className="text-[12px] xl:text-[15px] text-left font-[600] text-[#756D78] ml-[5px]">
                      vs last month
                    </p>
                  </div>
                </div>
                <div className="w-[35%]">
                  <Image src={UpchartMini} alt="upchartmini" />
                </div>
              </div>
            </div>
            <div
              className="group_count h-[240px] xl:h-[200px] w-1/2 bg-[#111427] py-[15px] px-[20px]"
              style={{
                backgroundImage: `url(${GroupMask.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "26px",
                border: "1px solid #22263C",
              }}
            >
              <div className="flex justify-between items-center gap-[10px] mb-[20px]">
                <div className="monitor-logo p-[10px] w-[20%] bg-[#D72577] rounded-[11px] flex justify-center items-center">
                  <ExclamationLogo />
                </div>
                <div className="text-white w-[80%] text-[15px] xl:text-[18px] font-medium">
                  No of Threats Triggered
                </div>
              </div>
              <div className="flex justify-center items-center gap-[15px] w-full">
                <div className="w-[65%] flex flex-col justify-center">
                  {isLoadingThreatCount ? (
                    renderThreatCountSkeleton()
                  ) : (
                    <>
                      <p className="text-[25px] xl:text-[30px] text-left font-[600] text-[#EBEBEB]">
                        {threatCount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-[2px]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M21.2134 16.4497L13.6261 8.86242C13.2443 8.48056 13.0533 8.28963 12.8332 8.2181C12.6395 8.15517 12.4309 8.15517 12.2372 8.2181C12.0171 8.28963 11.8261 8.48056 11.4443 8.86242L8.80487 11.5018C8.42302 11.8837 8.23209 12.0746 8.01192 12.1461C7.81826 12.2091 7.60965 12.2091 7.41598 12.1461C7.19582 12.0746 7.00489 11.8837 6.62303 11.5018L1.92847 6.80725M21.2134 16.4497H14.4637M21.2134 16.4497V9.69999"
                            stroke="#F04438"
                            stroke-width="2.31419"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <p className="text-[12px] xl:text-[15px] text-left font-[600] text-[#D92D20]">
                          5%
                        </p>
                        <p className="text-[12px] xl:text-[15px] text-left font-[600] text-[#756D78] ml-[5px]">
                          vs last month
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="w-[35%]">
                  <Image src={DownchartMini} alt="downchartmini" />
                </div>
              </div>
            </div>
          </div>
          <div
            className="threat-chart h-[580px] xl:h-[520px] bg-[#111427] p-4 md:p-5 lg:p-6"
            style={{
              backgroundImage: `url(${GroupMaskChart.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              borderRadius: "26px",
              border: "1px solid #22263C",
            }}
          >
            <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
              <h3 className="text-[16px] xs:text-[18px] md:text-[20px] font-medium text-[#F1F1F1] whitespace-nowrap mr-4">
                Category Analytics
              </h3>
              <div className="flex flex-wrap items-center gap-x-[10px] md:gap-x-[20px] gap-y-2">
                <div className="flex items-center gap-[5px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="flex-shrink-0"
                  >
                    <circle
                      cx="5.46193"
                      cy="5.00002"
                      r="4.5381"
                      fill="url(#paint0_linear_3_2456)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_3_2456"
                        x1="5.46193"
                        y1="0.461914"
                        x2="5.46193"
                        y2="9.53812"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#4A3AFF" />
                        <stop offset="1" stop-color="#6D3AFF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <p className="font-[400] text-[#615E83] text-xs sm:text-sm whitespace-nowrap">
                    Akira
                  </p>
                </div>
                <div className="flex items-center gap-[5px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="flex-shrink-0"
                  >
                    <circle
                      cx="4.69191"
                      cy="5.00002"
                      r="4.5381"
                      fill="#C893FD"
                    />
                  </svg>
                  <p className="font-[400] text-[#615E83] text-xs sm:text-sm whitespace-nowrap">
                    Fog
                  </p>
                </div>
                <div className="flex items-center gap-[5px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="flex-shrink-0"
                  >
                    <circle
                      cx="5.46193"
                      cy="5.00002"
                      r="4.5381"
                      fill="#FF9458"
                    />
                  </svg>
                  <p className="font-[400] text-[#615E83] text-xs sm:text-sm whitespace-nowrap">
                    FunkSec
                  </p>
                </div>
                <div className="select relative">
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    style={{
                      color: "rgba(255, 255, 255, 0.90)",
                      paddingRight: "28px",
                    }}
                    className="bg-[#443759] text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full border border-[#413B58] focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="month">Monthly</option>
                    <option value="week">Weekly</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[75%] sm:h-[80%] md:h-[85%]">
              {typeof window !== "undefined" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="0"
                      stroke="#413B58"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={{ stroke: "rgba(229, 229, 239, 0.15)" }}
                      tickLine={false}
                      tick={{ fill: "#756D78", fontSize: 12 }}
                      padding={{ left: 5 }}
                    />
                    <YAxis
                      axisLine={{ stroke: "rgba(229, 229, 239, 0.15)" }}
                      tickLine={false}
                      tick={{ fill: "#756D78", fontSize: 12 }}
                      domain={[0, 500]}
                      tickCount={6}
                      label={{
                        value: "No of Victims",
                        angle: -90,
                        position: "insideLeft",
                        style: {
                          textAnchor: "middle",
                          fill: "#D3D3D3",
                          fontSize: 14,
                        },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1D2032",
                        borderColor: "#22263C",
                        borderRadius: "8px",
                        padding: "10px",
                      }}
                      labelStyle={{ color: "#fff", marginBottom: "5px" }}
                      itemStyle={{ color: "#fff", padding: "2px 0" }}
                      formatter={(value, name) => {
                        let displayName = name;
                        if (name === "akira") displayName = "Akira";
                        if (name === "fog") displayName = "Fog";
                        if (name === "funkSec") displayName = "FunkSec";
                        return [`${value} victims`, displayName];
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="akira"
                      stroke="#4A3AFF"
                      strokeWidth={2}
                      dot={{ fill: "#4A3AFF", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="fog"
                      stroke="#C893FD"
                      strokeWidth={2}
                      dot={{ fill: "#C893FD", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="funkSec"
                      stroke="#FF9458"
                      strokeWidth={2}
                      dot={{ fill: "#FF9458", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
        <div
          className="threat-triggered w-full lg:w-[35%] h-[840px] xl:h-[740px] bg-[#111427] p-5 md:p-6"
          style={{
            backgroundImage: `url(${GroupMaskThreat.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "26px",
            border: "1px solid #22263C",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-white">
              Total Threats Triggered
            </h3>
            <div className="relative">
              <select 
                className="bg-[#443759] text-white text-sm px-4 py-2 pr-10 rounded-full border border-[#413B58] focus:outline-none cursor-pointer appearance-none"
                value={alertTimePeriod}
                onChange={handleAlertTimePeriodChange}
                disabled={isLoadingAlertTypes}
              >
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="all">All Time</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-[#B435D4] text-4xl font-semibold mb-8">
            {isLoadingAlertTypes ? (
              <Skeleton className="h-[50px] w-[150px] bg-[#2A2E3F]" />
            ) : (
              threatsTriggered.toLocaleString()
            )}
          </div>

          <div
            className="space-y-4 overflow-y-auto pr-2"
            style={{ maxHeight: "calc(100% - 140px)" }}
          >
            {isLoadingAlertTypes ? (
              renderAlertTypesSkeleton()
            ) : alertPercentages.length === 0 ? (
              <div className="text-white text-center py-4">No alert data available</div>
            ) : (
              alertPercentages.map((alert, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-6 h-6 rounded-full ${
                      index % 4 === 0 ? "bg-[#B435D4]" : 
                      index % 4 === 1 ? "bg-[#4A3AFF]" : 
                      index % 4 === 2 ? "bg-[#FF9458]" : 
                      "bg-[#8B85C1]"
                    } flex-shrink-0`}></div>
                    <span className="text-white whitespace-nowrap w-24 flex-shrink-0">
                      {alert.alert_type === "phishing" ? "Phishing" : alert.alert_type === "malware" ? "Malware" : alert.alert_type === "ransomware" ? "Ransomware" : alert.alert_type === "data-breach" ? "Data Breach"  : alert.alert_type}
                    </span>
                    <div className="h-1.5 w-full bg-[#2A2E3F] rounded-full overflow-hidden flex-grow">
                      <div
                        className={`h-full rounded-full ${
                          index % 4 === 0 ? "bg-gradient-to-r from-[#B435D4] to-[#D072E0]" : 
                          index % 4 === 1 ? "bg-[#4A3AFF]" : 
                          index % 4 === 2 ? "bg-[#FF9458]" : 
                          "bg-[#8B85C1]"
                        }`}
                        style={{ width: `${alert.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`whitespace-nowrap w-10 text-right flex-shrink-0 ${
                      index % 4 === 0 ? "text-[#B435D4]" : 
                      index % 4 === 1 ? "text-[#4A3AFF]" : 
                      index % 4 === 2 ? "text-[#FF9458]" : 
                      "text-[#8B85C1]"
                    }`}>
                      {alert.percentage}%
                    </span>
                  </div>
                  <div className="border-b border-[#2A2E3F]"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-y-[20px] mt-8">
        <h1 className="text-3xl font-bold text-[#EBEBEB]">Module Overview</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Cyber Module Card */}
          <div
            className="rounded-[26px] bg-[#111427] border border-[#22263C] p-6 flex flex-col"
            style={{
              backgroundImage: `url(${ModuleMask.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[24px] text-white font-medium">CyberIQ</h2>
              <span
                className="bg-[#6D3AFF] text-[#B435D4] px-4 py-1 rounded-full text-sm"
                style={{
                  background: "rgba(180, 53, 212, 0.24)",
                }}
              >
                Launching First
              </span>
            </div>

            <div className="space-y-6 mt-auto">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="23"
                    viewBox="0 0 22 23"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10.9079 0.591919C10.5579 0.591919 10.254 0.679086 9.97123 0.79431C9.71502 0.898711 9.42742 1.04768 9.11546 1.20926L2.21024 4.78522C1.67366 5.06302 1.18061 5.31828 0.829518 5.57074C0.466017 5.83213 0.00192084 6.26762 5.89225e-06 6.96245C-0.00190178 7.6573 0.459799 8.09527 0.821846 8.35859C1.17154 8.61291 1.66317 8.8708 2.19821 9.15145L9.09686 12.7711C9.41195 12.9364 9.70231 13.0888 9.96107 13.1957C10.2466 13.3135 10.5538 13.4027 10.9079 13.4027C11.2621 13.4027 11.5693 13.3135 11.8549 13.1957C12.1135 13.0889 12.4039 12.9364 12.7189 12.7711L19.6176 9.15151C20.1527 8.87083 20.6444 8.61293 20.994 8.35859C21.356 8.09527 21.8178 7.6573 21.8159 6.96245C21.8139 6.26762 21.3499 5.83213 20.9864 5.57074C20.6353 5.31827 20.1422 5.06301 19.6056 4.78521L12.7004 1.20925C12.3885 1.04768 12.1009 0.898711 11.8447 0.79431C11.5619 0.679086 11.258 0.591919 10.9079 0.591919ZM10.6919 2.51125C10.8406 2.45064 10.8902 2.4499 10.9079 2.4499C10.9256 2.4499 10.9753 2.45064 11.124 2.51125C11.2904 2.5791 11.501 2.68708 11.8556 2.87073L18.6678 6.39851C19.1582 6.65251 19.4901 6.82606 19.7188 6.96805C19.4909 7.11126 19.16 7.28659 18.671 7.54318L11.8654 11.114C11.5073 11.3019 11.2946 11.4124 11.1263 11.4819C10.9759 11.544 10.9258 11.5447 10.9079 11.5447C10.8901 11.5447 10.8399 11.544 10.6895 11.4819C10.5213 11.4124 10.3086 11.3019 9.95052 11.114L3.1449 7.54318C2.65586 7.28658 2.32502 7.11126 2.09712 6.96805C2.32581 6.82607 2.65761 6.65251 3.14806 6.39853L9.96026 2.87073C10.3149 2.68708 10.5254 2.5791 10.6919 2.51125Z"
                      fill="#E3E3E3"
                    />
                    <path
                      d="M1.39023 11.0797C0.932581 10.8374 0.361175 11.0054 0.114037 11.4573C-0.133544 11.9099 0.0392938 12.4736 0.497706 12.7164L9.08318 17.2623C9.40037 17.4303 9.69257 17.5851 9.95305 17.6936C10.2405 17.8132 10.55 17.9039 10.907 17.9039C11.2641 17.9039 11.5736 17.8132 11.861 17.6936C12.1215 17.5851 12.4138 17.4303 12.7309 17.2623L21.3165 12.7164C21.7748 12.4736 21.9477 11.9099 21.7 11.4573C21.4529 11.0054 20.8816 10.8374 20.4239 11.0797L11.8713 15.6082C11.5108 15.7991 11.2965 15.9115 11.1271 15.9821C10.9755 16.0451 10.9249 16.0459 10.907 16.0459C10.8891 16.0459 10.8385 16.0451 10.687 15.9821C10.5175 15.9115 10.3033 15.7991 9.94281 15.6082L1.39023 11.0797Z"
                      fill="#E3E3E3"
                    />
                    <path
                      d="M1.39023 15.5836C0.932581 15.3413 0.361175 15.5094 0.114037 15.9612C-0.133544 16.4139 0.0392938 16.9776 0.497706 17.2202L9.08315 21.7663C9.40035 21.9343 9.69257 22.089 9.95305 22.1975C10.2405 22.3171 10.55 22.4078 10.907 22.4078C11.2641 22.4078 11.5736 22.3171 11.861 22.1975C12.1214 22.089 12.4136 21.9343 12.7308 21.7663L21.3165 17.2202C21.7748 16.9776 21.9477 16.4139 21.7 15.9612C21.4529 15.5094 20.8816 15.3413 20.4239 15.5836L11.8713 20.1122C11.5108 20.3031 11.2965 20.4154 11.1271 20.4861C10.9755 20.5491 10.9249 20.5498 10.907 20.5498C10.8891 20.5498 10.8385 20.5491 10.687 20.4861C10.5175 20.4154 10.3033 20.3031 9.94281 20.1122L1.39023 15.5836Z"
                      fill="#E3E3E3"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white text-lg font-medium">
                    Real Time Feed
                  </h3>
                  <p className="text-[#999999] mt-1">
                    Monitor posts from Telegram channels in real-time with
                    advanced search and filtering capabilities. Covers
                    hacktivism, data breaches, ransomware groups, DDoS groups,
                    and more, providing intelligence from over 1,000+ Telegram
                    channels, groups, and discussion forums.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="23"
                    viewBox="0 0 22 23"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10.9079 0.591919C10.5579 0.591919 10.254 0.679086 9.97123 0.79431C9.71502 0.898711 9.42742 1.04768 9.11546 1.20926L2.21024 4.78522C1.67366 5.06302 1.18061 5.31828 0.829518 5.57074C0.466017 5.83213 0.00192084 6.26762 5.89225e-06 6.96245C-0.00190178 7.6573 0.459799 8.09527 0.821846 8.35859C1.17154 8.61291 1.66317 8.8708 2.19821 9.15145L9.09686 12.7711C9.41195 12.9364 9.70231 13.0888 9.96107 13.1957C10.2466 13.3135 10.5538 13.4027 10.9079 13.4027C11.2621 13.4027 11.5693 13.3135 11.8549 13.1957C12.1135 13.0889 12.4039 12.9364 12.7189 12.7711L19.6176 9.15151C20.1527 8.87083 20.6444 8.61293 20.994 8.35859C21.356 8.09527 21.8178 7.6573 21.8159 6.96245C21.8139 6.26762 21.3499 5.83213 20.9864 5.57074C20.6353 5.31827 20.1422 5.06301 19.6056 4.78521L12.7004 1.20925C12.3885 1.04768 12.1009 0.898711 11.8447 0.79431C11.5619 0.679086 11.258 0.591919 10.9079 0.591919ZM10.6919 2.51125C10.8406 2.45064 10.8902 2.4499 10.9079 2.4499C10.9256 2.4499 10.9753 2.45064 11.124 2.51125C11.2904 2.5791 11.501 2.68708 11.8556 2.87073L18.6678 6.39851C19.1582 6.65251 19.4901 6.82606 19.7188 6.96805C19.4909 7.11126 19.16 7.28659 18.671 7.54318L11.8654 11.114C11.5073 11.3019 11.2946 11.4124 11.1263 11.4819C10.9759 11.544 10.9258 11.5447 10.9079 11.5447C10.8901 11.5447 10.8399 11.544 10.6895 11.4819C10.5213 11.4124 10.3086 11.3019 9.95052 11.114L3.1449 7.54318C2.65586 7.28658 2.32502 7.11126 2.09712 6.96805C2.32581 6.82607 2.65761 6.65251 3.14806 6.39853L9.96026 2.87073C10.3149 2.68708 10.5254 2.5791 10.6919 2.51125Z"
                      fill="#E3E3E3"
                    />
                    <path
                      d="M1.39023 11.0797C0.932581 10.8374 0.361175 11.0054 0.114037 11.4573C-0.133544 11.9099 0.0392938 12.4736 0.497706 12.7164L9.08318 17.2623C9.40037 17.4303 9.69257 17.5851 9.95305 17.6936C10.2405 17.8132 10.55 17.9039 10.907 17.9039C11.2641 17.9039 11.5736 17.8132 11.861 17.6936C12.1215 17.5851 12.4138 17.4303 12.7309 17.2623L21.3165 12.7164C21.7748 12.4736 21.9477 11.9099 21.7 11.4573C21.4529 11.0054 20.8816 10.8374 20.4239 11.0797L11.8713 15.6082C11.5108 15.7991 11.2965 15.9115 11.1271 15.9821C10.9755 16.0451 10.9249 16.0459 10.907 16.0459C10.8891 16.0459 10.8385 16.0451 10.687 15.9821C10.5175 15.9115 10.3033 15.7991 9.94281 15.6082L1.39023 11.0797Z"
                      fill="#E3E3E3"
                    />
                    <path
                      d="M1.39023 15.5836C0.932581 15.3413 0.361175 15.5094 0.114037 15.9612C-0.133544 16.4139 0.0392938 16.9776 0.497706 17.2202L9.08315 21.7663C9.40035 21.9343 9.69257 22.089 9.95305 22.1975C10.2405 22.3171 10.55 22.4078 10.907 22.4078C11.2641 22.4078 11.5736 22.3171 11.861 22.1975C12.1214 22.089 12.4136 21.9343 12.7308 21.7663L21.3165 17.2202C21.7748 16.9776 21.9477 16.4139 21.7 15.9612C21.4529 15.5094 20.8816 15.3413 20.4239 15.5836L11.8713 20.1122C11.5108 20.3031 11.2965 20.4154 11.1271 20.4861C10.9755 20.5491 10.9249 20.5498 10.907 20.5498C10.8891 20.5498 10.8385 20.5491 10.687 20.4861C10.5175 20.4154 10.3033 20.3031 9.94281 20.1122L1.39023 15.5836Z"
                      fill="#E3E3E3"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white text-lg font-medium">
                    Alert Settings
                  </h3>
                  <p className="text-[#999999] mt-1">
                    Configure custom alerts based on specific keywords, threats
                    actors or types of threat
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="23"
                    viewBox="0 0 22 23"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10.9079 0.591919C10.5579 0.591919 10.254 0.679086 9.97123 0.79431C9.71502 0.898711 9.42742 1.04768 9.11546 1.20926L2.21024 4.78522C1.67366 5.06302 1.18061 5.31828 0.829518 5.57074C0.466017 5.83213 0.00192084 6.26762 5.89225e-06 6.96245C-0.00190178 7.6573 0.459799 8.09527 0.821846 8.35859C1.17154 8.61291 1.66317 8.8708 2.19821 9.15145L9.09686 12.7711C9.41195 12.9364 9.70231 13.0888 9.96107 13.1957C10.2466 13.3135 10.5538 13.4027 10.9079 13.4027C11.2621 13.4027 11.5693 13.3135 11.8549 13.1957C12.1135 13.0889 12.4039 12.9364 12.7189 12.7711L19.6176 9.15151C20.1527 8.87083 20.6444 8.61293 20.994 8.35859C21.356 8.09527 21.8178 7.6573 21.8159 6.96245C21.8139 6.26762 21.3499 5.83213 20.9864 5.57074C20.6353 5.31827 20.1422 5.06301 19.6056 4.78521L12.7004 1.20925C12.3885 1.04768 12.1009 0.898711 11.8447 0.79431C11.5619 0.679086 11.258 0.591919 10.9079 0.591919ZM10.6919 2.51125C10.8406 2.45064 10.8902 2.4499 10.9079 2.4499C10.9256 2.4499 10.9753 2.45064 11.124 2.51125C11.2904 2.5791 11.501 2.68708 11.8556 2.87073L18.6678 6.39851C19.1582 6.65251 19.4901 6.82606 19.7188 6.96805C19.4909 7.11126 19.16 7.28659 18.671 7.54318L11.8654 11.114C11.5073 11.3019 11.2946 11.4124 11.1263 11.4819C10.9759 11.544 10.9258 11.5447 10.9079 11.5447C10.8901 11.5447 10.8399 11.544 10.6895 11.4819C10.5213 11.4124 10.3086 11.3019 9.95052 11.114L3.1449 7.54318C2.65586 7.28658 2.32502 7.11126 2.09712 6.96805C2.32581 6.82607 2.65761 6.65251 3.14806 6.39853L9.96026 2.87073C10.3149 2.68708 10.5254 2.5791 10.6919 2.51125Z"
                      fill="#E3E3E3"
                    />
                    <path
                      d="M1.39023 11.0797C0.932581 10.8374 0.361175 11.0054 0.114037 11.4573C-0.133544 11.9099 0.0392938 12.4736 0.497706 12.7164L9.08318 17.2623C9.40037 17.4303 9.69257 17.5851 9.95305 17.6936C10.2405 17.8132 10.55 17.9039 10.907 17.9039C11.2641 17.9039 11.5736 17.8132 11.861 17.6936C12.1215 17.5851 12.4138 17.4303 12.7309 17.2623L21.3165 12.7164C21.7748 12.4736 21.9477 11.9099 21.7 11.4573C21.4529 11.0054 20.8816 10.8374 20.4239 11.0797L11.8713 15.6082C11.5108 15.7991 11.2965 15.9115 11.1271 15.9821C10.9755 16.0451 10.9249 16.0459 10.907 16.0459C10.8891 16.0459 10.8385 16.0451 10.687 15.9821C10.5175 15.9115 10.3033 15.7991 9.94281 15.6082L1.39023 11.0797Z"
                      fill="#E3E3E3"
                    />
                    <path
                      d="M1.39023 15.5836C0.932581 15.3413 0.361175 15.5094 0.114037 15.9612C-0.133544 16.4139 0.0392938 16.9776 0.497706 17.2202L9.08315 21.7663C9.40035 21.9343 9.69257 22.089 9.95305 22.1975C10.2405 22.3171 10.55 22.4078 10.907 22.4078C11.2641 22.4078 11.5736 22.3171 11.861 22.1975C12.1214 22.089 12.4136 21.9343 12.7308 21.7663L21.3165 17.2202C21.7748 16.9776 21.9477 16.4139 21.7 15.9612C21.4529 15.5094 20.8816 15.3413 20.4239 15.5836L11.8713 20.1122C11.5108 20.3031 11.2965 20.4154 11.1271 20.4861C10.9755 20.5491 10.9249 20.5498 10.907 20.5498C10.8891 20.5498 10.8385 20.5491 10.687 20.4861C10.5175 20.4154 10.3033 20.3031 9.94281 20.1122L1.39023 15.5836Z"
                      fill="#E3E3E3"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white text-lg font-medium">
                    Threat Actor Library
                  </h3>
                  <p className="text-[#999999] mt-1">
                    Access a comprehensive database of monitored threat actors
                    with detailed profiles and activity timelines
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OSINT Module Card */}
        <div
          className="rounded-[26px] bg-[#111427] border border-[#22263C] p-6 flex flex-col"
          style={{
            backgroundImage: `url(${ModuleMask.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[24px] text-white font-medium">DiplomatIQ</h2>
            <span
              className="text-[#9F9F9F] text-center px-4 py-1 rounded-full text-sm"
              style={{
                background: "rgba(169, 169, 169, 0.24)",
              }}
            >
              Coming soon
            </span>
          </div>

          <p className="text-[#999999] mb-[15px]">
            Focuses on geopolitical conflicts, military movements, and
            diplomatic intelligence, tracking over 50,000+ Telegram sources.
          </p>

          <div className="flex">
            <button
              className="text-white px-6 py-3 text-sm"
              style={{
                background: "rgba(255, 255, 255, 0.10)",
                border: "1.389px solid #8310A0",
                borderRadius: "9px",
              }}
            >
              Request early Access
            </button>
          </div>

          <div className="mt-12 text-[#413B58] text-[64px] font-bold opacity-10 tracking-wider text-center">
            Coming soon
          </div>
        </div>

        {/* Crime Monitoring Module Card */}
        <div
          className="rounded-[26px] bg-[#111427] border border-[#22263C] p-6 flex flex-col"
          style={{
            backgroundImage: `url(${ModuleMask.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-[24px] text-white font-medium">
              CyberCrimeIQ (Exclusive for Governments)
            </h2>
            <span
              className="text-[#9F9F9F] text-center px-4 py-1 rounded-full text-sm"
              style={{
                background: "rgba(169, 169, 169, 0.24)",
              }}
            >
              Coming Soon
            </span>
          </div>

          <p className="text-[#999999] mb-[15px]">
            Provides intelligence on criminal networks, including drugs, arms
            trafficking, terror groups, human trafficking, and counterfeits,
            covering 3,000+ Telegram groups.
          </p>

          <div className="flex">
            <button
              className="text-white px-6 py-3 text-sm"
              style={{
                background: "rgba(255, 255, 255, 0.10)",
                border: "1.389px solid #8310A0",
                borderRadius: "9px",
              }}
            >
              Request early Access
            </button>
          </div>

          <div className="mt-12 text-[#413B58] text-[64px] font-bold opacity-10 tracking-wider text-center">
            Coming soon
          </div>
        </div>
      </section>

      <section className="bg-[#111427] border border-[#22263C] py-10 px-8 md:px-10 rounded-[26px] mt-8 h-[450px] relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${EmpowerMask.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
          }}
        ></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-[45%] xl:w-[35%] mb-8 md:mb-0">
              <h2 className="text-[28px] font-bold text-white leading-tight w-full">
                Empowering your
                <br />
                Cyber Security
                <br />
                Strategy
              </h2>
            </div>

            <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Comprehensive Threat Intelligence */}
              <div>
                <div className="mb-4 flex justify-center md:justify-start">
                  <Image
                    src={Comprehensive}
                    alt="Comprehensive Threat Intelligence"
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">
                  Comprehensive Threat Intelligence
                </h3>
                <div className="h-1 w-36 bg-gradient-to-r from-[#A958E3] to-[#5D307D] rounded-full mb-3"></div>
                <p className="text-gray-400 text-sm">
                  Gain a holistic view of the threat landscape by combining data
                  from multiple sources and modules.
                </p>
              </div>

              {/* Proactive Risk Mitigation */}
              <div>
                <div className="mb-4 flex justify-center md:justify-start">
                  <Image
                    src={Proactive}
                    alt="Proactive Risk Mitigation"
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">
                  Proactive Risk Mitigation
                </h3>
                <div className="h-1 w-36 bg-gradient-to-r from-[#A958E3] to-[#5D307D] rounded-full mb-3"></div>
                <p className="text-gray-400 text-sm">
                  Stay ahead of potential threats with real-time alerts and
                  actionable intelligence.
                </p>
              </div>

              {/* Data-Driven Decision Making */}
              <div>
                <div className="mb-4 flex justify-center md:justify-start">
                  <Image
                    src={Decision}
                    alt="Data-Driven Decision Making"
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">
                  Data-Driven Decision Making
                </h3>
                <div className="h-1 w-36 bg-gradient-to-r from-[#A958E3] to-[#5D307D] rounded-full mb-3"></div>
                <p className="text-gray-400 text-sm">
                  Leverage advanced analytics and visualization to make informed
                  security decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
