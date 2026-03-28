import { DataProvider, fetchUtils } from "ra-core";
import { BASE_URL } from "@/constants";
import queryString from "query-string";

const apiUrl = BASE_URL;
const httpClient = (url: string, options: fetchUtils.Options = {}) => {
    const token = localStorage.getItem("token");

    options.headers = new Headers({
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });

    return fetchUtils.fetchJson(url, options);
};

export const dataProvider: DataProvider = {
    getList: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const filterObject = {
            where: params.filter || {},
            include: params.meta?.include || [],
            limit: perPage,
            skip: (page - 1) * perPage,
            order: [`${field} ${order}`],
        };

        const query = {
            filter: JSON.stringify(filterObject),
        };

        const url = `${apiUrl}/${resource}?${queryString.stringify(query)}`;

        const { json } = await httpClient(url);

        return {
            data: Array.isArray(json) ? json : (json.data || []),
            total: json.total || 0,
        };
    },


    getOne: async (resource, params) => {
        if (params.meta?.responseType === 'blob') {
            const token = localStorage.getItem('token')
            const response = await fetch(`${apiUrl}/${resource}/${params.id}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            })
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            const fileBlob = await response.blob()
            return { data: { id: params.id, fileBlob } }
        }

        return httpClient(`${apiUrl}/${resource}/${params.id}`)
            .then(({ json }) => ({ data: json }))
    },

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${queryString.stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${queryString.stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt((headers.get('content-range') || "0").split('/').pop() || '0', 10),
        }));
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${apiUrl}/${resource}?${queryString.stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id } as any,
        })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${apiUrl}/${resource}?${queryString.stringify(query)}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json }));
    }
};