import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchData } from '@/lib/ToolService';

export const PaginationSpl = ({
  meta,
  setMeta,
  setData,
  setLoading,
  toast,
  params
}) => {
  return (
    <>
      <Pagination>
        <PaginationContent>
          {meta?.links?.map((link, index) => {
            let label = link?.label;
            if (index == 0) {
              label = <ChevronLeft />;
            }
            if (index == meta?.links?.length - 1) {
              label = <ChevronRight />;
            }
            return (
              <>
                <PaginationItem>
                  <PaginationLink
                    className={`${meta?.current_page == label
                      ? "bg-primary text-white"
                      : ""
                      }  
                      ${link?.url == null
                        ? "opacity-50 pointer-events-none"
                        : ""
                      }
                          cursor-pointer`}
                    onClick={async () => {
                      const data = await fetchData(
                        setLoading,
                        toast,
                        params,
                        link?.url
                      );
                      setMeta(data?.meta);
                      setData(data?.data);
                    }}
                  >
                    {label}
                  </PaginationLink>
                </PaginationItem>
              </>
            );
          })}
        </PaginationContent>
      </Pagination>
    </>
  )
}
