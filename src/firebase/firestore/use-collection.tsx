// =================================================================================================================================================================
// HOOK: USE-COLLECTION (FIRESTORE)
// =================================================================================================================================================================
'use client';

// =================================================================================================================================================================
// IMPORTACIONES
// =================================================================================================================================================================
import { useState, useEffect } from 'react';
import { onSnapshot, Query } from 'firebase/firestore';

// =================================================================================================================================================================
// DEFINICIÓN DEL HOOK
// =================================================================================================================================================================
export function useCollection(query: Query | null) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
        setData(null);
        setLoading(false);
        return;
    }
    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const docs: any[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
