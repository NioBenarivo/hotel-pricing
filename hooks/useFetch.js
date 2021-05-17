import { useEffect, useState } from 'react'

const useFetch = (url, options) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(url, options)
        const json = await res.json()
        setData(json)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    };
    
    fetchData();
  }, []);
  
  return { data, error, loading }
};

export default useFetch