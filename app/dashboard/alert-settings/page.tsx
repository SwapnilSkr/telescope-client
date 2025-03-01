"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pencil from "@/public/pencil.png";
import Image from "next/image";
import AlertMask from "@/public/alertmask.png"

export default function AlertSettings() {
  const [keyword, setKeyword] = useState("");
  const [frequency, setFrequency] = useState("immediate");
  const [selectedAlertTypes, setSelectedAlertTypes] = useState<string[]>([
    "ransomware",
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentIntegration, setCurrentIntegration] = useState<any>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  const alertTypes = [
    { id: "ransomware", label: "Ransomware" },
    { id: "phishing", label: "Phishing" },
    { id: "data-breach", label: "Data Breach" },
    { id: "malware", label: "Malware" },
  ];

  const [integrationTypes, setIntegrationTypes] = useState([
    {
      id: "teams",
      label: "Microsoft teams",
      connected: false,
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="43"
          height="40"
          viewBox="0 0 43 40"
          fill="none"
        >
          <g clip-path="url(#clip0_3_221)">
            <path
              d="M29.6087 15.0009H40.5734C41.6093 15.0009 42.449 15.8515 42.449 16.9008V27.0178C42.449 30.8745 39.3627 34.0008 35.5555 34.0008H35.5229C31.7157 34.0014 28.629 30.8754 28.6284 27.0188C28.6284 27.0185 28.6284 27.0182 28.6284 27.0178V15.9939C28.6284 15.4454 29.0673 15.0009 29.6087 15.0009Z"
              fill="#5059C9"
            />
            <path
              d="M37.0185 13.001C39.4719 13.001 41.4608 10.9863 41.4608 8.50098C41.4608 6.0157 39.4719 4.00098 37.0185 4.00098C34.5651 4.00098 32.5762 6.0157 32.5762 8.50098C32.5762 10.9863 34.5651 13.001 37.0185 13.001Z"
              fill="#5059C9"
            />
            <path
              d="M23.2004 13.0023C26.7443 13.0023 29.6171 10.0922 29.6171 6.50233C29.6171 2.91247 26.7443 0.00231934 23.2004 0.00231934C19.6566 0.00231934 16.7837 2.91247 16.7837 6.50233C16.7837 10.0922 19.6566 13.0023 23.2004 13.0023Z"
              fill="#7B83EB"
            />
            <path
              d="M31.7564 15.0009H13.6573C12.6337 15.0265 11.8241 15.887 11.8478 16.9239V28.4629C11.7049 34.6851 16.5645 39.8486 22.7068 40.0009C28.8492 39.8486 33.7088 34.6851 33.5659 28.4629V16.9239C33.5896 15.887 32.7799 15.0265 31.7564 15.0009Z"
              fill="#7B83EB"
            />
            <path
              opacity="0.1"
              d="M23.6915 15.0009V31.1709C23.6866 31.9124 23.243 32.5785 22.5661 32.8608C22.3506 32.9532 22.1189 33.0008 21.8849 33.0009H12.714C12.5856 32.6709 12.4672 32.3409 12.3685 32.0009C12.0229 30.8534 11.8466 29.6605 11.8452 28.4609V16.9209C11.8215 15.8856 12.6299 15.0265 13.6518 15.0009H23.6915Z"
              fill="black"
            />
            <path
              opacity="0.2"
              d="M22.7043 15.0009V32.1708C22.7043 32.4079 22.6573 32.6425 22.5661 32.8608C22.2874 33.5465 21.6298 33.9959 20.8978 34.0008H13.178C13.0101 33.6708 12.8522 33.3408 12.714 33.0008C12.5758 32.6609 12.4672 32.3408 12.3685 32.0009C12.0229 30.8534 11.8466 29.6605 11.8452 28.4609V16.9209C11.8215 15.8856 12.6299 15.0265 13.6518 15.0009H22.7043Z"
              fill="black"
            />
            <path
              opacity="0.2"
              d="M22.7043 15.0009V30.1709C22.6968 31.1784 21.8923 31.9932 20.8977 32.0009H12.3685C12.0229 30.8534 11.8466 29.6605 11.8452 28.4609V16.9209C11.8215 15.8856 12.6299 15.0265 13.6518 15.0009H22.7043Z"
              fill="black"
            />
            <path
              opacity="0.2"
              d="M21.7171 15.0009V30.1709C21.7096 31.1784 20.9051 31.9932 19.9105 32.0009H12.3685C12.0229 30.8534 11.8466 29.6605 11.8452 28.4609V16.9209C11.8215 15.8856 12.6299 15.0265 13.6518 15.0009H21.7171Z"
              fill="black"
            />
            <path
              opacity="0.1"
              d="M23.6906 9.82974V12.9797C23.5228 12.9897 23.3649 12.9997 23.197 12.9997C23.0292 12.9898 22.8713 12.9797C22.7034 12.9797C22.3702 12.9573 22.0397 12.9038 21.7163 12.8197C19.7172 12.3402 18.0656 10.92 17.2739 8.99975C17.1377 8.67727 17.0319 8.34243 16.958 7.99976H21.8841C22.8802 8.00358 23.6868 8.82064 23.6906 9.82974Z"
              fill="black"
            />
            <path
              opacity="0.2"
              d="M22.7054 10.8294V12.9794C22.3722 12.957 22.0417 12.9034 21.7182 12.8194C19.7192 12.3398 18.0676 10.9197 17.2759 8.99939H20.8988C21.895 9.00321 22.7016 9.82029 22.7054 10.8294Z"
              fill="black"
            />
            <path
              opacity="0.2"
              d="M22.7054 10.8294V12.9794C22.3722 12.957 22.0417 12.9034 21.7182 12.8194C19.7192 12.3398 18.0676 10.9197 17.2759 8.99939H20.8988C21.895 9.00321 22.7016 9.82029 22.7054 10.8294Z"
              fill="black"
            />
            <path
              opacity="0.2"
              d="M21.7182 10.8294V12.8194C19.7192 12.3398 18.0676 10.9197 17.2759 8.99939H19.9117C20.9078 9.00323 21.7144 9.82031 21.7182 10.8294Z"
              fill="black"
            />
            <path
              d="M1.8095 8.99939H19.9086C20.9079 8.99939 21.7181 9.82006 21.7181 10.8324V29.1664C21.7181 30.1787 20.9079 30.9994 19.9086 30.9994H1.8095C0.810134 30.9994 0 30.1787 0 29.1664V10.8324C0 9.82006 0.810153 8.99939 1.8095 8.99939Z"
              fill="#5A62C3"
            />
            <path
              d="M15.6191 15.9785H12.001V25.9585H9.69598V15.9785H6.09473V14.0425H15.6191V15.9785Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_3_221">
              <rect width="42.449" height="40" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: "slack",
      label: "Slack",
      connected: true,
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
        >
          <g clip-path="url(#clip0_3_241)">
            <path
              d="M8.61515 25.197C8.61515 27.4962 6.74665 29.3545 4.43477 29.3545C2.1229 29.3545 0.254395 27.4962 0.254395 25.197C0.254395 22.8978 2.1229 21.0396 4.43477 21.0396H8.61515V25.197ZM10.7053 25.197C10.7053 22.8978 12.5738 21.0396 14.8857 21.0396C17.1976 21.0396 19.0661 22.8978 19.0661 25.197V35.5907C19.0661 37.8899 17.1976 39.7482 14.8857 39.7482C12.5738 39.7482 10.7053 37.8899 10.7053 35.5907V25.197Z"
              fill="#E01E5A"
            />
            <path
              d="M14.8871 8.50393C12.5752 8.50393 10.7067 6.64566 10.7067 4.34645C10.7067 2.04723 12.5752 0.188965 14.8871 0.188965C17.199 0.188965 19.0675 2.04723 19.0675 4.34645V8.50393H14.8871ZM14.8871 10.6142C17.199 10.6142 19.0675 12.4724 19.0675 14.7716C19.0675 17.0709 17.199 18.9291 14.8871 18.9291H4.4045C2.09262 18.9291 0.224121 17.0709 0.224121 14.7716C0.224121 12.4724 2.09262 10.6142 4.4045 10.6142H14.8871Z"
              fill="#36C5F0"
            />
            <path
              d="M31.6404 14.7716C31.6404 12.4724 33.5089 10.6142 35.8208 10.6142C38.1327 10.6142 40.0012 12.4724 40.0012 14.7716C40.0012 17.0709 38.1327 18.9291 35.8208 18.9291H31.6404V14.7716ZM29.5502 14.7716C29.5502 17.0709 27.6817 18.9291 25.3698 18.9291C23.058 18.9291 21.1895 17.0709 21.1895 14.7716V4.34645C21.1895 2.04723 23.058 0.188965 25.3698 0.188965C27.6817 0.188965 29.5502 2.04723 29.5502 4.34645V14.7716Z"
              fill="#2EB67D"
            />
            <path
              d="M25.3698 31.4333C27.6817 31.4333 29.5502 33.2915 29.5502 35.5907C29.5502 37.8899 27.6817 39.7482 25.3698 39.7482C23.058 39.7482 21.1895 37.8899 21.1895 35.5907V31.4333H25.3698ZM25.3698 29.3545C23.058 29.3545 21.1895 27.4962 21.1895 25.197C21.1895 22.8978 23.058 21.0396 25.3698 21.0396H35.8524C38.1643 21.0396 40.0328 22.8978 40.0328 25.197C40.0328 27.4962 38.1643 29.3545 35.8524 29.3545H25.3698Z"
              fill="#ECB22E"
            />
          </g>
          <defs>
            <clipPath id="clip0_3_241">
              <rect width="40" height="40" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: "webhook",
      label: "Webhook",
      connected: false,
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="45"
          height="40"
          viewBox="0 0 45 40"
          fill="none"
        >
          <path
            d="M21.45 0.00012207H21.4L20.9 0.100122C19.8 0.233455 18.725 0.541789 17.675 1.02512C16.625 1.50846 15.7 2.15012 14.9 2.95012C13.5333 4.18346 12.5833 5.70012 12.05 7.50012C11.75 8.50012 11.6167 9.55012 11.65 10.6501C11.6833 11.7501 11.8833 12.8001 12.25 13.8001C12.8167 15.3001 13.6833 16.6001 14.85 17.7001L15.5 18.3001L11.35 25.0501C10.4833 25.0168 9.73333 25.1335 9.1 25.4001C8.1 25.8335 7.35 26.5001 6.85 27.4001C6.61667 27.9001 6.46667 28.4168 6.4 28.9501C6.33333 29.4835 6.36667 30.0168 6.5 30.5501C6.76667 31.5501 7.31667 32.3501 8.15 32.9501C8.65 33.2835 9.2 33.5251 9.8 33.6751C10.4 33.8251 11 33.8585 11.6 33.7751C12.2 33.6918 12.775 33.4835 13.325 33.1501C13.875 32.8168 14.3333 32.4001 14.7 31.9001C15.1 31.3335 15.3417 30.6835 15.425 29.9501C15.5083 29.2168 15.4167 28.5335 15.15 27.9001C15.1167 27.7335 15 27.5001 14.8 27.2001L14.65 26.9001L20.55 17.3001C20.75 17.0001 20.8833 16.7668 20.95 16.6001L20.45 16.4501C20.15 16.3835 19.9333 16.3168 19.8 16.2501C19.0333 15.9168 18.3417 15.4585 17.725 14.8751C17.1083 14.2918 16.6333 13.6335 16.3 12.9001C15.7333 11.7001 15.5833 10.4501 15.85 9.15012C15.9833 8.38345 16.2667 7.66679 16.7 7.00012C17.1333 6.33345 17.65 5.76679 18.25 5.30012C19.4833 4.40012 20.85 3.95012 22.35 3.95012C23.25 3.91679 24.125 4.07512 24.975 4.42512C25.825 4.77512 26.5667 5.28346 27.2 5.95012C27.7667 6.48345 28.2083 7.12512 28.525 7.87512C28.8417 8.62512 29.0167 9.38345 29.05 10.1501C29.05 10.7168 28.95 11.4168 28.75 12.2501L32.25 13.2001L32.65 13.2501C33.1167 11.8168 33.2333 10.3835 33 8.95012C32.8667 7.85012 32.5417 6.79179 32.025 5.77512C31.5083 4.75846 30.85 3.86679 30.05 3.10012C28.65 1.70012 26.9333 0.766789 24.9 0.300122C24.7 0.233455 24.4 0.166789 24 0.100122L23.3 0.00012207H21.45ZM22.35 6.20012C21.7833 6.20012 21.2167 6.31679 20.65 6.55012C20.0833 6.78345 19.575 7.12512 19.125 7.57512C18.675 8.02512 18.35 8.55012 18.15 9.15012C17.8833 9.81679 17.8167 10.5501 17.95 11.3501C18.05 11.9501 18.2833 12.5168 18.65 13.0501C19.0167 13.5835 19.4833 14.0001 20.05 14.3001C20.85 14.8001 21.7833 15.0168 22.85 14.9501C22.95 15.0835 23.0333 15.2168 23.1 15.3501L28.7 24.9001C28.8 25.1001 28.9 25.2501 29 25.3501C29.9 24.4835 30.875 23.8918 31.925 23.5751C32.975 23.2585 34.0583 23.2001 35.175 23.4001C36.2917 23.6001 37.2667 24.0335 38.1 24.7001C39.1667 25.5335 39.8917 26.5585 40.275 27.7751C40.6583 28.9918 40.6667 30.2168 40.3 31.4501C40.0333 32.3835 39.5583 33.2168 38.875 33.9501C38.1917 34.6835 37.3833 35.2335 36.45 35.6001C35.4167 36.0335 34.3083 36.1751 33.125 36.0251C31.9417 35.8751 30.8833 35.4668 29.95 34.8001C29.8167 34.7001 29.6 34.5335 29.3 34.3001L29.05 34.0001C28.9167 34.1001 28.7333 34.2668 28.5 34.5001L26.15 36.8001C26.9167 37.5668 27.7833 38.2085 28.75 38.7251C29.7167 39.2418 30.7333 39.6001 31.8 39.8001L32.9 40.0001H34.85L36.25 39.7501C38.3833 39.3168 40.2167 38.3168 41.75 36.7501C42.4833 36.0168 43.0917 35.1751 43.575 34.2251C44.0583 33.2751 44.3833 32.2835 44.55 31.2501C44.7167 30.0501 44.6833 28.8585 44.45 27.6751C44.2167 26.4918 43.8 25.4168 43.2 24.4501C42.6 23.4835 41.8667 22.6335 41 21.9001C40.1333 21.1668 39.1833 20.5835 38.15 20.1501C37.0167 19.6835 35.8417 19.4168 34.625 19.3501C33.4083 19.2835 32.2167 19.4001 31.05 19.7001L30.2 19.9501L26.15 13.1001C26.5833 12.4668 26.85 11.8501 26.95 11.2501C27.1167 10.1835 26.9 9.18345 26.3 8.25012C25.7667 7.41679 25.0333 6.83345 24.1 6.50012C23.5333 6.30012 22.95 6.20012 22.35 6.20012ZM8.25 19.4001C6.31667 19.8335 4.65 20.7168 3.25 22.0501C1.68333 23.5168 0.666667 25.2668 0.2 27.3001L0 28.5001V30.3501L0.1 30.9001C0.166667 31.3335 0.233333 31.6668 0.3 31.9001C0.533333 32.9335 0.941667 33.9168 1.525 34.8501C2.10833 35.7835 2.81667 36.6001 3.65 37.3001C5.31667 38.6668 7.23333 39.4835 9.4 39.7501C10.6667 39.8835 11.9333 39.8085 13.2 39.5251C14.4667 39.2418 15.6333 38.7668 16.7 38.1001C18.4667 36.9668 19.7667 35.4501 20.6 33.5501C20.8333 32.9835 21.0667 32.2335 21.3 31.3001C21.5 31.2668 21.8 31.2668 22.2 31.3001L28.45 31.4001C28.9167 31.4001 29.25 31.4168 29.45 31.4501C29.8167 32.1168 30.2333 32.6335 30.7 33.0001C31.1667 33.3668 31.6917 33.6335 32.275 33.8001C32.8583 33.9668 33.45 34.0335 34.05 34.0001C34.9833 33.9001 35.8167 33.5668 36.55 33.0001C37.45 32.3001 37.9833 31.4001 38.15 30.3001C38.2167 29.7335 38.1917 29.1835 38.075 28.6501C37.9583 28.1168 37.7333 27.6168 37.4 27.1501C36.8667 26.4168 36.1833 25.8835 35.35 25.5501C34.7833 25.3168 34.1917 25.2085 33.575 25.2251C32.9583 25.2418 32.3667 25.3668 31.8 25.6001C30.8667 26.0001 30.15 26.6168 29.65 27.4501L29.5 27.7501C29.0333 27.7501 28.3333 27.7335 27.4 27.7001L21.75 27.6501C21.25 27.6168 20.5333 27.6001 19.6 27.6001L17.1 27.5501L17.25 28.4001C17.5167 29.8335 17.3 31.1835 16.6 32.4501C16.1333 33.3501 15.4667 34.1001 14.6 34.7001C13.7333 35.3001 12.7833 35.6668 11.75 35.8001C10.5833 36.0001 9.41667 35.8751 8.25 35.4251C7.08333 34.9751 6.13333 34.2668 5.4 33.3001C4.46667 32.1335 4.01667 30.8168 4.05 29.3501C4.08333 28.1168 4.46667 26.9668 5.2 25.9001C5.63333 25.2668 6.16667 24.7335 6.8 24.3001C7.43333 23.8668 8.11667 23.5501 8.85 23.3501L9.3 23.2001L8.25 19.4001Z"
            fill="#515151"
          />
          <path
            d="M21.4495 0.00012207H21.3995L20.8995 0.100122C19.7995 0.233455 18.7245 0.541789 17.6745 1.02512C16.6245 1.50846 15.6995 2.15012 14.8995 2.95012C13.5329 4.18346 12.5829 5.70012 12.0495 7.50012C11.7495 8.50012 11.6162 9.55012 11.6495 10.6501C11.6829 11.7501 11.8829 12.8001 12.2495 13.8001C12.8162 15.3001 13.6829 16.6001 14.8495 17.7001L15.4995 18.3001L11.3495 25.0501C10.4829 25.0168 9.73288 25.1335 9.09954 25.4001C8.09954 25.8335 7.34954 26.5001 6.84954 27.4001C6.61621 27.9001 6.46621 28.4168 6.39954 28.9501C6.33288 29.4835 6.36621 30.0168 6.49954 30.5501C6.76621 31.5501 7.31621 32.3501 8.14954 32.9501C8.64954 33.2835 9.19954 33.5251 9.79954 33.6751C10.3995 33.8251 10.9995 33.8585 11.5995 33.7751C12.1995 33.6918 12.7745 33.4835 13.3245 33.1501C13.8745 32.8168 14.3329 32.4001 14.6995 31.9001C15.0995 31.3335 15.3412 30.6835 15.4245 29.9501C15.5079 29.2168 15.4162 28.5335 15.1495 27.9001C15.1162 27.7335 14.9995 27.5001 14.7995 27.2001L14.6495 26.9001L20.5495 17.3001C20.7495 17.0001 20.8829 16.7668 20.9495 16.6001L20.4495 16.4501C20.1495 16.3835 19.9329 16.3168 19.7995 16.2501C19.0329 15.9168 18.3412 15.4585 17.7245 14.8751C17.1079 14.2918 16.6329 13.6335 16.2995 12.9001C15.7329 11.7001 15.5829 10.4501 15.8495 9.15012C15.9829 8.38345 16.2662 7.66679 16.6995 7.00012C17.1329 6.33345 17.6495 5.76679 18.2495 5.30012C19.4829 4.40012 20.8495 3.95012 22.3495 3.95012C23.2495 3.91679 24.1245 4.07512 24.9745 4.42512C25.8245 4.77512 26.5662 5.28346 27.1995 5.95012C27.7662 6.48345 28.2079 7.12512 28.5245 7.87512C28.8412 8.62512 29.0162 9.38345 29.0495 10.1501C29.0495 10.7168 28.9495 11.4168 28.7495 12.2501L32.2495 13.2001L32.6495 13.2501C33.1162 11.8168 33.2329 10.3835 32.9995 8.95012C32.8662 7.85012 32.5412 6.79179 32.0245 5.77512C31.5079 4.75846 30.8495 3.86679 30.0495 3.10012C28.6495 1.70012 26.9329 0.766789 24.8995 0.300122C24.6995 0.233455 24.3995 0.166789 23.9995 0.100122L23.2995 0.00012207H21.4495Z"
            fill="#C94068"
          />
        </svg>
      ),
    },
    {
      id: "api",
      label: "API",
      connected: false,
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="40"
          viewBox="0 0 32 40"
          fill="none"
        >
          <path
            d="M30.5232 12.8594C30.9564 12.4193 31.1997 11.8227 31.1997 11.2008C31.1997 10.5788 30.9564 9.98228 30.5232 9.54221L21.8004 0.687649C21.3664 0.247355 20.7778 -4.62116e-07 20.1641 -4.82382e-07C19.5504 -5.02648e-07 18.9618 0.247355 18.5278 0.687649C18.0938 1.12794 17.85 1.72511 17.85 2.34778C17.85 2.97045 18.0938 3.56762 18.5278 4.00791L23.3025 8.85375L5.51304 8.85375C4.89951 8.85375 4.31111 9.10103 3.87727 9.54118C3.44344 9.98133 3.19971 10.5783 3.19971 11.2008C3.19971 11.8233 3.44344 12.4202 3.87727 12.8604C4.31111 13.3005 4.89951 13.5478 5.51304 13.5478L23.3025 13.5478L18.5278 18.3921C18.3129 18.6101 18.1425 18.8689 18.0262 19.1538C17.9099 19.4386 17.85 19.7439 17.85 20.0522C17.85 20.3605 17.9099 20.6658 18.0262 20.9507C18.1425 21.2355 18.3129 21.4943 18.5278 21.7123C18.7427 21.9304 18.9978 22.1033 19.2785 22.2213C19.5593 22.3393 19.8602 22.4 20.1641 22.4C20.468 22.4 20.7689 22.3393 21.0497 22.2213C21.3304 22.1033 21.5855 21.9304 21.8004 21.7123L30.5232 12.8594Z"
            fill="#FF3232"
          />
          <path
            d="M0.67654 27.1406C0.24333 27.5807 1.40083e-07 28.1773 1.32714e-07 28.7992C1.25344e-07 29.4212 0.24333 30.0177 0.67654 30.4578L9.39932 39.3124C9.83329 39.7526 10.4219 40 11.0356 40C11.6493 40 12.2379 39.7526 12.6719 39.3124C13.1059 38.8721 13.3497 38.2749 13.3497 37.6522C13.3497 37.0295 13.1059 36.4324 12.6719 35.9921L7.8972 31.1462L25.6867 31.1462C26.3002 31.1462 26.8886 30.899 27.3224 30.4588C27.7563 30.0187 28 29.4217 28 28.7992C28 28.1767 27.7563 27.5798 27.3224 27.1396C26.8886 26.6995 26.3002 26.4522 25.6867 26.4522L7.8972 26.4522L12.6719 21.6079C12.8868 21.3899 13.0572 21.1311 13.1735 20.8462C13.2898 20.5614 13.3497 20.2561 13.3497 19.9478C13.3497 19.6395 13.2898 19.3342 13.1735 19.0493C13.0572 18.7645 12.8868 18.5057 12.6719 18.2877C12.457 18.0696 12.2019 17.8967 11.9212 17.7787C11.6404 17.6607 11.3395 17.6 11.0356 17.6C10.7317 17.6 10.4308 17.6607 10.1501 17.7787C9.8693 17.8967 9.6142 18.0696 9.39932 18.2877L0.67654 27.1406Z"
            fill="#FF3232"
          />
        </svg>
      ),
    },
  ]);

  const toggleAlertType = (typeId: string) => {
    setSelectedAlertTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const openConnectModal = (integration: any) => {
    setCurrentIntegration(integration);
    setApiKey("");
    setApiSecret("");
    setIsModalOpen(true);
  };

  const openEditModal = (integration: any) => {
    setCurrentIntegration(integration);
    // In a real app, you might fetch existing values from an API
    // For now, we'll just use placeholder values
    setApiKey("existing-api-key");
    setApiSecret("existing-api-secret");
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentIntegration(null);
  };

  const handleSaveIntegration = () => {
    setIntegrationTypes((prevIntegrations) =>
      prevIntegrations.map((integration) =>
        integration.id === currentIntegration.id
          ? { ...integration, connected: true }
          : integration
      )
    );

    closeModal();
  };

  const handleUpdateIntegration = () => {
    // In a real app, you would update the integration with new credentials
    // For now, we'll just close the modal
    closeModal();
  };

  return (
    <div className="text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Custom Alert Settings</h1>

      <div className="bg-[#121229] rounded-[26px] p-6 space-y-8" style={{
        backgroundImage: `url(${AlertMask.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: "1px solid #22263C",
      }}>
        <div>
          <p className="text-base font-medium mb-2">
            Search Keyword or threat actor
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Input
              className="pl-10 py-6 text-white w-full"
              style={{
                borderRadius: "136.083px",
                border: "1.389px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(255, 255, 255, 0.11)",
              }}
              placeholder="Enter keyword or threat actor name"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        <div className="border-t border-[#2a2a40] pt-6">
          <div className="flex justify-between items-start">
            <div className="w-1/2">
              <p className="text-base font-medium">Alert Type:</p>
              <p className="text-sm text-gray-400">
                Choose on which type of attack you need to get alerted
              </p>
            </div>
            <div className="flex flex-col space-y-4 w-1/2">
              {alertTypes.map((type) => (
                <div key={type.id} className={`flex items-center p-2 rounded `}>
                  <Checkbox
                    id={type.id}
                    checked={selectedAlertTypes.includes(type.id)}
                    className={
                      selectedAlertTypes.includes(type.id)
                        ? "bg-purple-600 border-purple-600"
                        : ""
                    }
                    onCheckedChange={() => toggleAlertType(type.id)}
                  />
                  <label
                    htmlFor={type.id}
                    className="ml-2 text-sm cursor-pointer"
                    onClick={() => toggleAlertType(type.id)}
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#2a2a40] pt-6">
          <div className="flex justify-between items-start">
            <div className="flex justify-between items-start mb-4 w-1/2">
              <div>
                <p className="text-base font-medium">Integration Type:</p>
                <p className="text-sm text-gray-400">
                  Choose on which platform the attack need to get alerted
                </p>
              </div>
            </div>
            <div className="space-y-3 w-1/2">
              {integrationTypes.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between bg-[#1e1e38] p-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center mr-3">
                      {integration.svg}
                    </div>
                    <span>{integration.label}</span>
                  </div>
                  {integration.connected ? (
                    <div className="flex items-center">
                      <span className="bg-purple-900 text-white text-xs px-3 py-1 rounded-full mr-2">
                        Connected
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-gray-400 hover:text-white"
                        onClick={() => openEditModal(integration)}
                      >
                        <Image
                          src={Pencil}
                          alt="pencil"
                          width={20}
                          height={20}
                        />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="bg-transparent text-white hover:bg-[#2a2a40]"
                      style={{
                        borderRadius: "91px",
                        border: "1px solid rgba(255, 255, 255, 0.60)",
                      }}
                      onClick={() => openConnectModal(integration)}
                    >
                      Connect +
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#2a2a40] pt-6 flex justify-between items-start">
          <div className="w-1/2">
            <p className="text-base font-medium">Alert Frequency:</p>
            <p className="text-sm text-gray-400">
              Choose on which platform the attack need to get alerted
            </p>
          </div>
          <div className="w-1/2">
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="bg-[#1e1e38] border-none text-white mt-2 py-6">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e38] border-[#2a2a40] text-white">
                <SelectItem value="immediate">Immediately</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Integration Connection Modal */}
      {isModalOpen && currentIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#121229] rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex items-center mb-6">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                {currentIntegration.svg}
              </div>
              <h2 className="text-xl font-semibold">
                {currentIntegration.label} Integration
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Add API Key</label>
                <input
                  type="text"
                  placeholder="Type API key here"
                  className="w-full bg-[#1e1e38] border-none rounded-lg p-3 text-white"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Add API Secret</label>
                <textarea
                  placeholder="Type API secret here"
                  className="w-full bg-[#1e1e38] border-none rounded-lg p-3 text-white h-32 resize-none"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  onClick={handleSaveIntegration}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Edit Modal */}
      {isEditModalOpen && currentIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#121229] rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex items-center mb-6">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                {currentIntegration.svg}
              </div>
              <h2 className="text-xl font-semibold">
                Edit {currentIntegration.label} Integration
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Update API Key</label>
                <input
                  type="text"
                  placeholder="Type API key here"
                  className="w-full bg-[#1e1e38] border-none rounded-lg p-3 text-white"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Update API Secret</label>
                <textarea
                  placeholder="Type API secret here"
                  className="w-full bg-[#1e1e38] border-none rounded-lg p-3 text-white h-32 resize-none"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                />
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  className="bg-transparent hover:bg-[#2a2a40] border border-gray-600 text-white px-6"
                  onClick={() => {
                    // Add confirmation dialog in a real app
                    setIntegrationTypes((prevIntegrations) =>
                      prevIntegrations.map((integration) =>
                        integration.id === currentIntegration.id
                          ? { ...integration, connected: false }
                          : integration
                      )
                    );
                    closeModal();
                  }}
                >
                  Disconnect
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  onClick={handleUpdateIntegration}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
