import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Checkbox, { CheckboxStatus } from './index';

const meta = {
  title: 'Commons/Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '체크박스 컴포넌트입니다. 기본 모드(checked)와 고급 모드(status)를 지원하며, react-hook-form과 완벽하게 호환됩니다. partial 상태는 status prop으로만 사용 가능합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '체크박스 선택 상태 (기본 모드, react-hook-form 호환)',
      table: {
        type: { summary: 'boolean' },
      },
    },
    status: {
      control: 'select',
      options: ['unselected', 'selected', 'partial'],
      description: '체크박스의 선택 상태 (고급 모드, partial 지원)',
      table: {
        type: { summary: 'CheckboxStatus' },
      },
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'press', 'focus', 'disabled', 'error'],
      description: '체크박스의 상태 (CSS 전용)',
      table: {
        type: { summary: 'CheckboxState' },
        defaultValue: { summary: 'default' },
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리 (상호작용 가능)
export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

// Status 스토리 (기본 모드)
export const Unselected: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

export const Selected: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(true);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

// Partial은 고급 모드만 지원
export const Partial: Story = {
  render: (args) => {
    const [status, setStatus] = React.useState<CheckboxStatus>('partial');
    return <Checkbox {...args} status={status} onStatusChange={setStatus} />;
  },
};

// State 스토리 - Unselected (시각적 상태 확인용)
export const UnselectedDefault: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        state="default"
        {...args}
      />
    );
  },
};

export const UnselectedHover: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        state="hover"
        {...args}
      />
    );
  },
};

export const UnselectedPress: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        state="press"
        {...args}
      />
    );
  },
};

export const UnselectedFocus: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        state="focus"
        {...args}
      />
    );
  },
};

export const UnselectedDisabled: Story = {
  args: {
    checked: false,
    state: 'disabled',
  },
};

export const UnselectedError: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        state="error"
        {...args}
      />
    );
  },
};

// State 스토리 - Selected
export const SelectedDefault: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(true);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        state="default"
        {...args}
      />
    );
  },
};

export const SelectedHover: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(true);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        state="hover"
        {...args}
      />
    );
  },
};

export const SelectedPress: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(true);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        state="press"
        {...args}
      />
    );
  },
};

export const SelectedFocus: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(true);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        state="focus"
        {...args}
      />
    );
  },
};

export const SelectedDisabled: Story = {
  args: {
    checked: true,
    state: 'disabled',
  },
};

export const SelectedError: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(true);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        state="error"
        {...args}
      />
    );
  },
};

// State 스토리 - Partial (고급 모드)
export const PartialDefault: Story = {
  render: (args) => {
    const [status, setStatus] = React.useState<CheckboxStatus>('partial');
    return (
      <Checkbox
        status={status}
        onStatusChange={setStatus}
        state="default"
        {...args}
      />
    );
  },
};

export const PartialHover: Story = {
  render: (args) => {
    const [status, setStatus] = React.useState<CheckboxStatus>('partial');
    return (
      <Checkbox
        status={status}
        onStatusChange={setStatus}
        state="hover"
        {...args}
      />
    );
  },
};

export const PartialPress: Story = {
  render: (args) => {
    const [status, setStatus] = React.useState<CheckboxStatus>('partial');
    return (
      <Checkbox
        status={status}
        onStatusChange={setStatus}
        state="press"
        {...args}
      />
    );
  },
};

export const PartialFocus: Story = {
  render: (args) => {
    const [status, setStatus] = React.useState<CheckboxStatus>('partial');
    return (
      <Checkbox
        status={status}
        onStatusChange={setStatus}
        state="focus"
        {...args}
      />
    );
  },
};

export const PartialDisabled: Story = {
  args: {
    status: 'partial',
    state: 'disabled',
  },
};

export const PartialError: Story = {
  render: (args) => {
    const [status, setStatus] = React.useState<CheckboxStatus>('partial');
    return (
      <Checkbox
        status={status}
        onStatusChange={setStatus}
        state="error"
        {...args}
      />
    );
  },
};

// Disabled prop 스토리 (disabled는 상호작용 불가하므로 args만 사용)
export const DisabledProp: Story = {
  args: {
    state: 'disabled',
    checked: true,
  },
};

// 조합 스토리
export const AllStatuses: Story = {
  render: () => {
    const [checked1, setChecked1] = React.useState(false);
    const [checked2, setChecked2] = React.useState(true);
    const [status3, setStatus3] = React.useState<CheckboxStatus>('partial');

    return (
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox
          checked={checked1}
          onChange={(e) => setChecked1(e.target.checked)}
        />
        <Checkbox
          checked={checked2}
          onChange={(e) => setChecked2(e.target.checked)}
        />
        <Checkbox status={status3} onStatusChange={setStatus3} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '모든 status 타입을 한 번에 확인할 수 있습니다. partial은 status prop을 사용합니다.',
      },
    },
  },
};

export const AllStatesUnselected: Story = {
  render: () => {
    const [checks, setChecks] = React.useState([
      false,
      false,
      false,
      false,
      false,
      false,
    ]);

    return (
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox
          checked={checks[0]}
          onChange={(e) =>
            setChecks((prev) => {
              const n = [...prev];
              n[0] = e.target.checked;
              return n;
            })
          }
          state="default"
        />
        <Checkbox
          checked={checks[1]}
          onChange={(e) =>
            setChecks((prev) => {
              const n = [...prev];
              n[1] = e.target.checked;
              return n;
            })
          }
          state="hover"
        />
        <Checkbox
          checked={checks[2]}
          onChange={(e) =>
            setChecks((prev) => {
              const n = [...prev];
              n[2] = e.target.checked;
              return n;
            })
          }
          state="press"
        />
        <Checkbox
          checked={checks[3]}
          onChange={(e) =>
            setChecks((prev) => {
              const n = [...prev];
              n[3] = e.target.checked;
              return n;
            })
          }
          state="focus"
        />
        <Checkbox checked={false} state="disabled" />
        <Checkbox
          checked={checks[5]}
          onChange={(e) =>
            setChecks((prev) => {
              const n = [...prev];
              n[5] = e.target.checked;
              return n;
            })
          }
          state="error"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Unselected 상태의 모든 state 타입을 확인할 수 있습니다.',
      },
    },
  },
};

export const AllStatesSelected: Story = {
  render: () => {
    const [checks, setChecks] = React.useState([
      true,
      true,
      true,
      true,
      true,
      true,
    ]);

    return (
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox
          checked={checks[0]}
          onChange={(e) =>
            setChecks((prev) => {
              const n = [...prev];
              n[0] = e.target.checked;
              return n;
            })
          }
          state="default"
        />
        <Checkbox
          checked={checks[1]}
          onChange={(e) =>
            setChecks((prev) => {
              const n = [...prev];
              n[1] = e.target.checked;
              return n;
            })
          }
          state="hover"
        />
        <Checkbox
          checked={checks[2]}
          onChange={(e) =>
            setChecks((prev) => {
              const n = [...prev];
              n[2] = e.target.checked;
              return n;
            })
          }
          state="press"
        />
        <Checkbox
          checked={checks[3]}
          onChange={(e) =>
            setChecks((prev) => {
              const n = [...prev];
              n[3] = e.target.checked;
              return n;
            })
          }
          state="focus"
        />
        <Checkbox checked={true} state="disabled" />
        <Checkbox
          checked={checks[5]}
          onChange={(e) =>
            setChecks((prev) => {
              const n = [...prev];
              n[5] = e.target.checked;
              return n;
            })
          }
          state="error"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Selected 상태의 모든 state 타입을 확인할 수 있습니다.',
      },
    },
  },
};

export const AllStatesPartial: Story = {
  render: () => {
    const [statuses, setStatuses] = React.useState<CheckboxStatus[]>([
      'partial',
      'partial',
      'partial',
      'partial',
      'partial',
      'partial',
    ]);

    return (
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox
          status={statuses[0]}
          onStatusChange={(s) =>
            setStatuses((prev) => {
              const n = [...prev];
              n[0] = s;
              return n;
            })
          }
          state="default"
        />
        <Checkbox
          status={statuses[1]}
          onStatusChange={(s) =>
            setStatuses((prev) => {
              const n = [...prev];
              n[1] = s;
              return n;
            })
          }
          state="hover"
        />
        <Checkbox
          status={statuses[2]}
          onStatusChange={(s) =>
            setStatuses((prev) => {
              const n = [...prev];
              n[2] = s;
              return n;
            })
          }
          state="press"
        />
        <Checkbox
          status={statuses[3]}
          onStatusChange={(s) =>
            setStatuses((prev) => {
              const n = [...prev];
              n[3] = s;
              return n;
            })
          }
          state="focus"
        />
        <Checkbox status="partial" state="disabled" />
        <Checkbox
          status={statuses[5]}
          onStatusChange={(s) =>
            setStatuses((prev) => {
              const n = [...prev];
              n[5] = s;
              return n;
            })
          }
          state="error"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Partial 상태의 모든 state 타입을 확인할 수 있습니다. partial은 status prop을 사용합니다.',
      },
    },
  },
};

export const StatusAndStateMatrix: Story = {
  render: () => {
    const [unselectedChecks, setUnselectedChecks] = React.useState([
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    const [selectedChecks, setSelectedChecks] = React.useState([
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
    const [partialStatuses, setPartialStatuses] = React.useState<
      CheckboxStatus[]
    >(['partial', 'partial', 'partial', 'partial', 'partial', 'partial']);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <div style={{ fontWeight: 'bold' }}>Status / State</div>
          <div style={{ fontWeight: 'bold' }}>Default</div>
          <div style={{ fontWeight: 'bold' }}>Hover</div>
          <div style={{ fontWeight: 'bold' }}>Press</div>
          <div style={{ fontWeight: 'bold' }}>Focus</div>
          <div style={{ fontWeight: 'bold' }}>Disabled</div>
          <div style={{ fontWeight: 'bold' }}>Error</div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <div style={{ fontWeight: 'bold' }}>Unselected</div>
          <Checkbox
            checked={unselectedChecks[0]}
            onChange={(e) =>
              setUnselectedChecks((p) => {
                const n = [...p];
                n[0] = e.target.checked;
                return n;
              })
            }
            state="default"
          />
          <Checkbox
            checked={unselectedChecks[1]}
            onChange={(e) =>
              setUnselectedChecks((p) => {
                const n = [...p];
                n[1] = e.target.checked;
                return n;
              })
            }
            state="hover"
          />
          <Checkbox
            checked={unselectedChecks[2]}
            onChange={(e) =>
              setUnselectedChecks((p) => {
                const n = [...p];
                n[2] = e.target.checked;
                return n;
              })
            }
            state="press"
          />
          <Checkbox
            checked={unselectedChecks[3]}
            onChange={(e) =>
              setUnselectedChecks((p) => {
                const n = [...p];
                n[3] = e.target.checked;
                return n;
              })
            }
            state="focus"
          />
          <Checkbox checked={false} state="disabled" />
          <Checkbox
            checked={unselectedChecks[5]}
            onChange={(e) =>
              setUnselectedChecks((p) => {
                const n = [...p];
                n[5] = e.target.checked;
                return n;
              })
            }
            state="error"
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <div style={{ fontWeight: 'bold' }}>Selected</div>
          <Checkbox
            checked={selectedChecks[0]}
            onChange={(e) =>
              setSelectedChecks((p) => {
                const n = [...p];
                n[0] = e.target.checked;
                return n;
              })
            }
            state="default"
          />
          <Checkbox
            checked={selectedChecks[1]}
            onChange={(e) =>
              setSelectedChecks((p) => {
                const n = [...p];
                n[1] = e.target.checked;
                return n;
              })
            }
            state="hover"
          />
          <Checkbox
            checked={selectedChecks[2]}
            onChange={(e) =>
              setSelectedChecks((p) => {
                const n = [...p];
                n[2] = e.target.checked;
                return n;
              })
            }
            state="press"
          />
          <Checkbox
            checked={selectedChecks[3]}
            onChange={(e) =>
              setSelectedChecks((p) => {
                const n = [...p];
                n[3] = e.target.checked;
                return n;
              })
            }
            state="focus"
          />
          <Checkbox checked={true} state="disabled" />
          <Checkbox
            checked={selectedChecks[5]}
            onChange={(e) =>
              setSelectedChecks((p) => {
                const n = [...p];
                n[5] = e.target.checked;
                return n;
              })
            }
            state="error"
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <div style={{ fontWeight: 'bold' }}>Partial</div>
          <Checkbox
            status={partialStatuses[0]}
            onStatusChange={(s) =>
              setPartialStatuses((p) => {
                const n = [...p];
                n[0] = s;
                return n;
              })
            }
            state="default"
          />
          <Checkbox
            status={partialStatuses[1]}
            onStatusChange={(s) =>
              setPartialStatuses((p) => {
                const n = [...p];
                n[1] = s;
                return n;
              })
            }
            state="hover"
          />
          <Checkbox
            status={partialStatuses[2]}
            onStatusChange={(s) =>
              setPartialStatuses((p) => {
                const n = [...p];
                n[2] = s;
                return n;
              })
            }
            state="press"
          />
          <Checkbox
            status={partialStatuses[3]}
            onStatusChange={(s) =>
              setPartialStatuses((p) => {
                const n = [...p];
                n[3] = s;
                return n;
              })
            }
            state="focus"
          />
          <Checkbox status="partial" state="disabled" />
          <Checkbox
            status={partialStatuses[5]}
            onStatusChange={(s) =>
              setPartialStatuses((p) => {
                const n = [...p];
                n[5] = s;
                return n;
              })
            }
            state="error"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '모든 status와 state의 조합을 한눈에 확인할 수 있는 매트릭스입니다. partial은 status prop을 사용합니다.',
      },
    },
  },
};

export const WithLabels: Story = {
  render: () => {
    const [checkedItems, setCheckedItems] = React.useState({
      item1: false,
      item2: true,
      item3: false,
    });

    const selectAllStatus: CheckboxStatus = (() => {
      const values = Object.values(checkedItems);
      const checkedCount = values.filter(Boolean).length;
      if (checkedCount === 0) return 'unselected';
      if (checkedCount === values.length) return 'selected';
      return 'partial';
    })();

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Checkbox
            status={selectAllStatus}
            onStatusChange={(status) => {
              const newValue = status === 'selected';
              setCheckedItems({
                item1: newValue,
                item2: newValue,
                item3: newValue,
              });
            }}
          />
          <span style={{ fontWeight: 'bold' }}>전체 선택 (partial 예시)</span>
        </label>
        <div
          style={{
            marginLeft: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Checkbox
              checked={checkedItems.item1}
              onChange={(e) =>
                setCheckedItems({ ...checkedItems, item1: e.target.checked })
              }
            />
            <span>옵션 1</span>
          </label>
          <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Checkbox
              checked={checkedItems.item2}
              onChange={(e) =>
                setCheckedItems({ ...checkedItems, item2: e.target.checked })
              }
            />
            <span>옵션 2</span>
          </label>
          <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Checkbox
              checked={checkedItems.item3}
              onChange={(e) =>
                setCheckedItems({ ...checkedItems, item3: e.target.checked })
              }
            />
            <span>옵션 3</span>
          </label>
        </div>
        <label
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            opacity: 0.5,
          }}
        >
          <Checkbox checked={true} state="disabled" />
          <span>옵션 4 (비활성화)</span>
        </label>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '실제 사용 예시입니다. 전체 선택 체크박스는 status prop으로 partial을 지원하고, 개별 체크박스는 checked prop을 사용합니다.',
      },
    },
  },
};
