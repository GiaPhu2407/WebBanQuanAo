import { useState, useEffect } from 'react';
import { Size, SizeResponse } from '@/app/Admin/type/size';
import { useToast } from '@/components/ui/use-toast';

export const useSize = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSizes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/size');
      const data: SizeResponse = await response.json();
      setSizes(data.size);
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: "Không thể tải danh sách kích thước",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  return { sizes, loading, refetch: fetchSizes };
};