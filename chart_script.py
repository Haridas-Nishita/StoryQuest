import plotly.graph_objects as go
import pandas as pd

# Load and process the data with original text (truncated to 15 chars)
data = {
  "workflow_data": [
    {
      "category": "Story Creation",
      "steps": [
        "Choose Template",  # truncated from "Choose Template or Start Fresh"
        "Write Segments", 
        "Create Chars",     # truncated from "Create Character Profiles"
        "Assign Voices",    # truncated from "Assign Murf AI Voices"
        "Build Branches",   # truncated from "Build Choice Branches"
        "Test Flow",        # truncated from "Test Story Flow"
        "Publish Story"
      ]
    },
    {
      "category": "Story Playing", 
      "steps": [
        "Browse Library",   # truncated from "Browse Story Library"
        "Select Adventure",
        "Read/Listen",      # truncated from "Read/Listen to Segment"
        "Make Choice",      # truncated from "Make Choice Decision"
        "Continue",         # truncated from "Continue to Next Segment"
        "Explore Paths",    # truncated from "Experience Different Paths"
        "Reach Ending"      # truncated from "Reach Story Ending"
      ]
    },
    {
      "category": "API Integration",
      "steps": [
        "Input Text",       # truncated from "Input Story Text"
        "Select Voice",     # truncated from "Select Character Voice"
        "Config Speech",    # truncated from "Configure Speech Parameters"
        "Send API Req",     # truncated from "Send API Request to Murf"
        "Receive Audio",    # truncated from "Receive Generated Audio"
        "Play in Browser",  # truncated from "Play Audio in Browser"
        "Save for Replay"
      ]
    }
  ]
}

# Create figure
fig = go.Figure()

# Define colors and positions
colors = ['#1FB8CD', '#DB4545', '#2E8B57']
workflow_names = ['Story Creation', 'Story Playing', 'API Integration']
x_positions = [2, 6, 10]
box_width = 2.5
box_height = 0.6

# Create data for scatter plot approach
x_coords = []
y_coords = []
text_labels = []
marker_colors = []

# Add background rectangles for each workflow column
for workflow_idx, workflow in enumerate(data['workflow_data']):
    x_pos = x_positions[workflow_idx]
    color = colors[workflow_idx]
    
    # Add background column
    fig.add_shape(
        type="rect",
        x0=x_pos - box_width/2 - 0.3, y0=-0.8,
        x1=x_pos + box_width/2 + 0.3, y1=len(workflow['steps']) + 0.3,
        fillcolor=color,
        opacity=0.1,
        line=dict(width=0)
    )
    
    # Add workflow category boxes
    for step_idx, step in enumerate(workflow['steps']):
        y_pos = len(workflow['steps']) - step_idx - 1
        
        # Add rectangle box for each step
        fig.add_shape(
            type="rect",
            x0=x_pos - box_width/2, y0=y_pos - box_height/2,
            x1=x_pos + box_width/2, y1=y_pos + box_height/2,
            fillcolor=color,
            opacity=0.8,
            line=dict(color=color, width=2)
        )
        
        # Collect coordinates and text for scatter plot
        x_coords.append(x_pos)
        y_coords.append(y_pos)
        text_labels.append(step[:15])  # Ensure 15 char limit
        marker_colors.append(color)
        
        # Add straight vertical arrows between steps
        if step_idx < len(workflow['steps']) - 1:
            next_y = len(workflow['steps']) - step_idx - 2
            fig.add_shape(
                type="line",
                x0=x_pos, y0=y_pos - box_height/2,
                x1=x_pos, y1=next_y + box_height/2,
                line=dict(color=color, width=4)
            )
            # Add arrowhead
            fig.add_shape(
                type="line",
                x0=x_pos - 0.1, y0=next_y + box_height/2 + 0.1,
                x1=x_pos, y1=next_y + box_height/2,
                line=dict(color=color, width=4)
            )
            fig.add_shape(
                type="line", 
                x0=x_pos + 0.1, y0=next_y + box_height/2 + 0.1,
                x1=x_pos, y1=next_y + box_height/2,
                line=dict(color=color, width=4)
            )

# Add scatter plot for text positioning
fig.add_trace(go.Scatter(
    x=x_coords,
    y=y_coords,
    mode='text',
    text=text_labels,
    textfont=dict(size=12, color='white'),
    showlegend=False,
    hoverinfo='none'
))

# Add workflow category titles
fig.add_trace(go.Scatter(
    x=x_positions,
    y=[7.8, 7.8, 7.8],
    mode='text',
    text=workflow_names,
    textfont=dict(size=16, color='black'),
    showlegend=False,
    hoverinfo='none'
))

# Add integration arrows between workflows
# Story Creation to API Integration
fig.add_shape(
    type="line",
    x0=3.5, y0=4,
    x1=8.5, y1=4,
    line=dict(color='gray', width=3, dash='dash')
)
fig.add_shape(
    type="line",
    x0=8.4, y0=4.1,
    x1=8.5, y1=4,
    line=dict(color='gray', width=3)
)
fig.add_shape(
    type="line", 
    x0=8.4, y0=3.9,
    x1=8.5, y1=4,
    line=dict(color='gray', width=3)
)

# API Integration to Story Playing
fig.add_shape(
    type="line",
    x0=8.5, y0=2,
    x1=3.5, y1=2,
    line=dict(color='gray', width=3, dash='dash')
)
fig.add_shape(
    type="line",
    x0=3.6, y0=2.1, 
    x1=3.5, y1=2,
    line=dict(color='gray', width=3)
)
fig.add_shape(
    type="line",
    x0=3.6, y0=1.9,
    x1=3.5, y1=2, 
    line=dict(color='gray', width=3)
)

# Update layout
fig.update_layout(
    title='VoiceQuest App Architecture Workflow',
    showlegend=False,
    xaxis=dict(visible=False),
    yaxis=dict(visible=False),
    plot_bgcolor='white',
    paper_bgcolor='white'
)

# Set tighter axis ranges for better use of space
fig.update_xaxes(range=[0, 12])
fig.update_yaxes(range=[-1, 8.5])

# Save the chart
fig.write_image('voicequest_workflow_chart.png')