import Papa from 'papaparse';
export class CsvService {
    async export(data, header = true) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Data must be a non-empty array.');
        }
        const csvContent = Papa.unparse(data, {
            header,
        });
        return new Blob([csvContent], { type: 'text/csv;charset=utf-8,' });
    }
    // import(file: File, chunkCallback, completeCallback): void {
    //   // return new Promise((resolve, reject) => {
    //   const reader = new FileReader()
    //   reader.onload = (event) => {
    //     const content = event.target.result as string
    //
    //     const parsedData = Papa.parse(content)
    //
    //     // Papa.parse(file, {
    //     //   header: true,
    //     //   skipEmptyLines: true,
    //     //   worker: true,
    //     //   chunkSize: 1024 * 1024,
    //     //   chunk: (results) => {
    //     //     chunkCallback(results)
    //     //   },
    //     //   complete: () => {
    //     //     console.log('parseComplete')
    //     //     completeCallback()
    //     //   },
    //     // })
    //
    //     const importedExpenses = parsedData.data as ImportedExpense[]
    //     resolve(importedExpenses)
    //   }
    //   reader.onerror = (event) => {
    //     reject(event)
    //   }
    //   reader.readAsText(file)
    //   })
    // }
    import(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (!event.target)
                    return;
                const content = event.target.result;
                const parsedData = Papa.parse(content, {
                    header: true,
                });
                const importedExpenses = parsedData.data;
                resolve(importedExpenses);
            };
            reader.onerror = (event) => {
                reject(event);
            };
            reader.readAsText(file);
        });
    }
}
