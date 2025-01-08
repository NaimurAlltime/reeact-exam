export const Dateformate = (isoString: any) => {
    const date = new Date(isoString);
    const day = date.getDate(); 
    const month = date.toLocaleString('default', { month: 'short' }); 
    const year = date.getFullYear(); 
  
    return `${day} ${month} ${year}`;
  };