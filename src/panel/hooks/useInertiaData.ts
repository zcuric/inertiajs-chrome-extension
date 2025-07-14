import { useEffect, useState } from "react";
import { MESSAGE_TYPES, STORAGE_KEYS, TIMEOUTS } from "../constants";
import type { InertiaPage, InertiaRequest } from "../types";

export const useInertiaData = (tabId: number) => {
	const [currentPage, setCurrentPage] = useState<InertiaPage | null>(null);
	const [requests, setRequests] = useState<InertiaRequest[]>([]);
	const [selectedRequest, setSelectedRequest] = useState<InertiaRequest | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [isInertiaDetected, setIsInertiaDetected] = useState(false);
	const [framework, setFramework] = useState<{
		name: string;
		version?: string;
	} | null>(null);
	const [previousPage, setPreviousPage] = useState<InertiaPage | null>(null);

	useEffect(() => {
		const detectedKey = `${STORAGE_KEYS.DETECTED_PREFIX}${tabId}`;
		const pageKey = `${STORAGE_KEYS.PAGE_PREFIX}${tabId}`;
		const requestsKey = `${STORAGE_KEYS.REQUESTS_PREFIX}${tabId}`;

		const getInitialData = () => {
			// Set a timeout to prevent indefinite loading state
			const timer = setTimeout(() => {
				setIsLoading(false);
			}, TIMEOUTS.LOADING_TIMEOUT);

			chrome.storage.local.get(
				[detectedKey, pageKey, requestsKey],
				(result) => {
					clearTimeout(timer);
					if (result[detectedKey]?.detected) {
						setIsInertiaDetected(true);
						setFramework(result[detectedKey]?.framework);
					}
					if (result[pageKey]?.page) {
						setCurrentPage(result[pageKey].page);
					}
					if (result[requestsKey]?.requests) {
						setRequests(result[requestsKey].requests);
					}
					setIsLoading(false);
				},
			);
		};

		getInitialData();

		const handleStorageChange = (
			changes: { [key: string]: chrome.storage.StorageChange },
			areaName: string,
		) => {
			if (areaName !== "local") return;

			if (changes[detectedKey]) {
				setIsInertiaDetected(changes[detectedKey].newValue?.detected);
				setFramework(changes[detectedKey].newValue?.framework);
			}
			if (changes[pageKey]) {
				setCurrentPage((prev) => {
					setPreviousPage(prev);
					return changes[pageKey].newValue?.page;
				});
			}
			if (changes[requestsKey]) {
				setRequests(changes[requestsKey].newValue?.requests || []);
			}
		};

		chrome.storage.onChanged.addListener(handleStorageChange);

		return () => {
			chrome.storage.onChanged.removeListener(handleStorageChange);
		};
	}, [tabId]);

	const handleClear = () => {
		setRequests([]);
		setSelectedRequest(null);
		chrome.runtime.sendMessage({
			type: MESSAGE_TYPES.CLEAR_INERTIA_REQUESTS,
			tabId: tabId,
		});
	};

	return {
		currentPage,
		requests,
		selectedRequest,
		isLoading,
		isInertiaDetected,
		framework,
		previousPage,
		setSelectedRequest,
		handleClear,
	};
};
