import { NextRequest, NextResponse } from 'next/server';

// Mock data for polls (same as in the main polls route)
const mockPolls = [
  {
    id: '1',
    title: 'What is your favorite programming language?',
    description: 'Please select the programming language you enjoy working with the most.',
    options: [
      { id: '1', text: 'JavaScript', votes: 42 },
      { id: '2', text: 'Python', votes: 35 },
      { id: '3', text: 'TypeScript', votes: 28 },
      { id: '4', text: 'Java', votes: 15 },
      { id: '5', text: 'C#', votes: 20 },
    ],
    createdAt: new Date('2023-05-15').toISOString(),
    createdBy: 'user1',
  },
  {
    id: '2',
    title: 'Which frontend framework do you prefer?',
    description: 'Vote for your favorite frontend framework or library.',
    options: [
      { id: '1', text: 'React', votes: 55 },
      { id: '2', text: 'Vue', votes: 30 },
      { id: '3', text: 'Angular', votes: 25 },
      { id: '4', text: 'Svelte', votes: 15 },
    ],
    createdAt: new Date('2023-06-20').toISOString(),
    createdBy: 'user2',
  },
  {
    id: '3',
    title: 'How do you prefer to style your web applications?',
    description: 'Select your preferred styling approach for web development.',
    options: [
      { id: '1', text: 'Tailwind CSS', votes: 48 },
      { id: '2', text: 'CSS Modules', votes: 22 },
      { id: '3', text: 'Styled Components', votes: 35 },
      { id: '4', text: 'SASS/SCSS', votes: 30 },
      { id: '5', text: 'Plain CSS', votes: 15 },
    ],
    createdAt: new Date('2023-07-10').toISOString(),
    createdBy: 'user1',
  },
];

// Helper function to find a poll by ID
function findPollById(id: string) {
  return mockPolls.find(poll => poll.id === id);
}

// GET handler for fetching a specific poll by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // Simulate a slight delay to mimic a database call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const poll = findPollById(id);
  
  if (!poll) {
    return NextResponse.json(
      { error: 'Poll not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ poll });
}

// PATCH handler for updating a poll (e.g., voting)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Simulate a slight delay to mimic a database call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const poll = findPollById(id);
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }
    
    // Handle voting
    if (body.vote) {
      const optionId = body.vote;
      const option = poll.options.find(opt => opt.id === optionId);
      
      if (!option) {
        return NextResponse.json(
          { error: 'Option not found' },
          { status: 400 }
        );
      }
      
      // Increment the vote count
      option.votes += 1;
      
      // In a real application, you would update the database
      // For this placeholder, we'll just return the updated poll
      
      return NextResponse.json({ poll });
    }
    
    // Handle other updates (title, description, etc.)
    // This would be implemented in a real application
    
    return NextResponse.json(
      { error: 'Unsupported update operation' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating poll:', error);
    return NextResponse.json(
      { error: 'Failed to update poll' },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a poll
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // Simulate a slight delay to mimic a database call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const pollIndex = mockPolls.findIndex(poll => poll.id === id);
  
  if (pollIndex === -1) {
    return NextResponse.json(
      { error: 'Poll not found' },
      { status: 404 }
    );
  }
  
  // In a real application, you would delete the poll from the database
  // For this placeholder, we'll just return a success response
  
  return NextResponse.json(
    { message: 'Poll deleted successfully' },
    { status: 200 }
  );
}