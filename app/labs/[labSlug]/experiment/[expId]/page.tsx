import { Suspense } from "react";
import { notFound } from "next/navigation";

import ExperimentClient from "./ExperimentClient";
import { practicalsData } from "@/data/practicalsData";

type ExperimentParams = {
  labSlug: string;
  expId: string;
};

type PageProps = {
  params: Promise<ExperimentParams>;
};

async function ExperimentContent({
  params,
}: PageProps) {
  const { expId, labSlug } = await params;

  const data = practicalsData[expId];

  if (!data) {
    notFound();
  }

  return <ExperimentClient data={data} experimentId={expId} labSlug={labSlug} />;
}

export default function ExperimentPage({
  params,
}: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-gray-600">
            Loading experiment...
          </p>
        </div>
      }
    >
      <ExperimentContent params={params} />
    </Suspense>
  );
}
