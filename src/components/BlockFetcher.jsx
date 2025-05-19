import { useEffect, useState } from "react";
import axios from "../api/axios";

const BlockFetcher = () => {
  const [fetchedBlocks, setFetchedBlocks] = useState([]);
  const [blockNeighborhoods, setBlockNeighborhoods] = useState({});

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const response = await axios.get("/block");
      const blocksData = response.data.data || [];
      setFetchedBlocks(blocksData);
      fetchNeighborhoods(blocksData.map((block) => block.id));
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  };

  const fetchNeighborhoods = async (blockIds) => {
    try {
      const neighborhoodsData = {};
      for (const blockId of blockIds) {
        const response = await axios.get(
          `/neighborhood-colony/block/${blockId}`
        );
        const data = response.data;
        if (data.status) {
          neighborhoodsData[blockId] = await Promise.all(
            data.data.map(async (neighborhood) => {
              const polygonResponse = await axios.get(
                `/districts-points/byNeighborhoodsColonies/${neighborhood.id}`
              );
              return { ...neighborhood, polygon: polygonResponse.data.data };
            })
          );
        }
      }
      setBlockNeighborhoods((prev) => ({ ...prev, ...neighborhoodsData }));
    } catch (error) {
      console.error("Error fetching neighborhoods:", error);
    }
  };

  return { fetchedBlocks, blockNeighborhoods, fetchBlocks };
};

export default BlockFetcher;
