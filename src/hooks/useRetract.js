import { useEffect } from 'react';

function useRetractEffect(retract, setBody) {
  useEffect(() => {
    if(retract === 'show'){
      setBody('expanded')
    } else {
      setBody('retract')
    }
    localStorage.setItem('retract', retract);
  }, [retract, setBody]);
}

export default useRetractEffect;