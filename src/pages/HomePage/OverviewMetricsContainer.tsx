import { css } from "@emotion/css";
import { ReactNode } from "react";
import * as theme from "../../theme";
import { icons } from "../../icons/icons";
import { useFragment } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { useNounsCount } from "../../hooks/useNounsCount";
import { useQuorumVotes } from "../../hooks/useQuorumVotes";
import { OverviewMetricsContainer$key } from "./__generated__/OverviewMetricsContainer.graphql";
import { useQuorumBps } from "../../hooks/useQuorumBps";
import { useProposalThreshold } from "../../hooks/useProposalThreshold";

type Props = {
  fragmentRef: OverviewMetricsContainer$key;
};

export function OverviewMetricsContainer({ fragmentRef }: Props) {
  const { delegates } = useFragment(
    graphql`
      fragment OverviewMetricsContainer on Query {
        delegates(
          first: 1000
          where: { tokenHoldersRepresentedAmount_gt: 0 }
          orderBy: tokenHoldersRepresentedAmount
          orderDirection: desc
        ) {
          id
        }
      }
    `,
    fragmentRef
  );

  const nounsCount = useNounsCount();
  const quorumCount = useQuorumVotes();
  const quorumBps = useQuorumBps();
  const proposalThreshold = useProposalThreshold();

  const votersCount = delegates.length;

  // todo: real values
  return (
    <div
      className={css`
        display: flex;
        max-width: ${theme.maxWidth["6xl"]};
        gap: ${theme.spacing["4"]};
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      `}
    >
      {/*todo: review this metric*/}
      <MetricContainer
        icon="community"
        title="Voters / Nouns"
        body={`${votersCount} / ${nounsCount} (${(
          (1 - votersCount / nounsCount.toNumber()) *
          100
        ).toFixed(0)}% delegation)`}
      />

      <MetricContainer
        icon="ballot"
        title="Quorum"
        body={`${quorumCount.toNumber()} nouns (${quorumBps
          .div(100)
          .toNumber()
          .toFixed(0)}% of supply)`}
      />

      <MetricContainer
        icon="measure"
        title="Proposal threshold"
        body={`${proposalThreshold} noun`}
      />

      {/*todo: review this metric*/}
      <MetricContainer icon="pedestrian" title="Avg voter turnout" body="54%" />
    </div>
  );
}

type MetricContainerProps = {
  icon: keyof typeof icons;
  title: string;
  body: ReactNode;
};

const color = "#FBFBFB";

function MetricContainer({ icon, title, body }: MetricContainerProps) {
  return (
    <div
      className={css`
        display: flex;
        background: ${theme.colors.white};
        flex-direction: row;
        border-radius: ${theme.spacing["3"]};
        padding: ${theme.spacing["3"]};
        border-width: ${theme.spacing.px};
        border-color: ${theme.colors.gray["300"]};
        box-shadow: ${theme.boxShadow.sm};
        gap: ${theme.spacing["3"]};
      `}
    >
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: ${theme.spacing["3"]};
          border-width: ${theme.spacing.px};
          border-color: ${theme.colors.gray["300"]};
          background: ${color};
          flex-shrink: 0;
          padding: ${theme.spacing["3"]};
        `}
      >
        <img
          className={css`
            width: 24px;
            height: 24px;
          `}
          src={icons[icon]}
          alt={icon}
        />
      </div>

      <div
        className={css`
          display: flex;
          flex-direction: column;
          padding-right: ${theme.spacing["1"]};
        `}
      >
        <div
          className={css`
            font-size: ${theme.fontSize.sm};
            color: ${theme.colors.gray["700"]};
            white-space: nowrap;
            text-overflow: ellipsis;
          `}
        >
          {title}
        </div>

        <div
          className={css`
            white-space: nowrap;
            text-overflow: ellipsis;
          `}
        >
          {body}
        </div>
      </div>
    </div>
  );
}