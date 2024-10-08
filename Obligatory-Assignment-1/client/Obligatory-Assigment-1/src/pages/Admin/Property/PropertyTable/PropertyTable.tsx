import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { Api } from '../../../../../Api';
import './PropertyTable.css';

interface Property {
    id: string;
    name: string;
}

export const MyApi = new Api();
export const propertiesAtom = atom<Property[]>([]);

function PropertyTable() {
    const [properties, setProperties] = useAtom(propertiesAtom);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MyApi.api.propertiesGetAllProperties();
                const propertiesData = response.data.map((item: any) => ({
                    id: item.id,
                    name: item.propertyName // Map propertyName to name
                })) as Property[];
                setProperties(propertiesData);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };
        fetchData();
    }, [setProperties]);

    return (
        <table className="text-black text-4xl text-left">
            <thead>
            <tr>
                <th className="table-cell-padding">Name</th>
                <th className="table-cell-padding"></th>
            </tr>
            </thead>
            <tbody>
            {properties.map((property, index) => (
                <tr key={index}>
                    <td className="table-cell-padding">{property.name}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default PropertyTable;