
import Message from '../models/chatModel';
import { getUserConversations } from '../utils/messages/getUserConversations';
import { getUserConversationsBetweenDates } from '../utils/messages/getUserConversationsBetweenDates';
import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import Channel from '../models/indexModel';


export const showChat = async (req: Request, res: Response) => {
    const users = await User.find().select('username _id');
    const channels = await Channel.find().select('name description members type _id');
    
    // Ensure the user's ID is retrieved from the session
    
    const userId = req.session.userId; 
    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.status(404).send('User nor found.');
    }
    res.render('chat', { isAdmin: user.isAdmin, users, channels, userId, username: user!.username}); 
};


// Display the private chat page
export const showPrivateChat = (req: Request, res: Response) => {
    res.render('privateChat', { error: null }); 
};



//display the create channel page
export const showCreateChannel = async (req: Request, res: Response) => {
    const users = await User.find().select('username _id');
    const channels = await Channel.find().select('name description members type _id');
    
    // Ensure the user's ID is retrieved from the session
    const userId = req.session.userId; 
    const user = await User.findById(req.session.userId);
    res.render('channels', { users, channels, userId, username: user!.username }); 
};


// Show all messages for a specific user
export const getUserConversationsController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId; 
        await getUserConversations(userId, req, res); 
    } catch (error) {
        console.error('Error when calling the function getUserConversations :', error);
        res.status(500).json({ message: 'Error when calling the function getUserConversations.' });
    }
};

// Messages from all users between two dates 

export const getUserConversationsBetweenDatesController = async (req: Request, res: Response) => {
    try {
        await getUserConversationsBetweenDates(req, res);
    } catch (error) {
        console.error('Error when calling the function getUserConversationsBetweenDates :', error);
        res.status(500).json({ message: 'Error when calling the function getUserConversationsBetweenDates.' });
    }
};
// manage session of user
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    if (req.session && req.session.userId) {
        next();
    } else {
      res.redirect('/');
    }
  };


/////////////////////////////////// CRUD //////////////////////////////////


  ////////////////
 //// CREATE //// 
////////////////

export const createMessage = async (req: Request, res: Response) => {
    try {
        const { content, user, channel, receiverId, messageType, createdAt } = req.body;// if ...req.body then without this line.
        const newMessage = new Message({
            content,
            user,
            channel,
            receiverId,
            messageType,
            createdAt,
        }); //or just ...req.body
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error('Wow.. Error creating the message :', error);
        res.status(500).json({message:'Wow.. Error creating the message', error});
    }
}


  ////////////////
 //// GET ALL ///
////////////////

export const getAllMessages = async (req: Request, res: Response) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        console.error('Wow.. Error , can\'t retrieve messages.', error);
        res.status(500).json({message: 'Wow.. Error , can\'t retrieve messages.'});
    }
}


  ///////////////////////////////
 //// GET ALL WiTH CHANNELID ///
///////////////////////////////

export const getAllMessagesByChannelId = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const messages = await Message.find({ channel: channelId });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error retrieving messages.', error);
        res.status(500).json({ message: 'Error retrieving messages.' });
    }
}



  ////////////////////
 //// GET WITH ID ///
////////////////////

export const getMessageById = async (req: Request, res: Response) => {
    try {
        const { channelID } = req.params;
        const message = await Message.find({channelID});
        if (!message) {
            return res.status(404).json({message: 'Houston, we have a problem! Message not found.'});
        }
        res.status(200).json(message);
        } catch (error) {
            console.error('Wow.. Error retrieving the message', error),
            res.status(500).json({message: 'Wow.. Error retrieving the message'});
    }
}


  ///////////////
 //// UPDATE ///
///////////////

export const updateMessage = async (req: Request, res: Response) => {
    try {
        const   { messageId } = req.params;
        const updatedMessage = await Message.findByIdAndUpdate(messageId, req.body, { new: true });
        if (!updatedMessage) {
            return res.status(404).json({message: 'Houston, we have a problem! Message not found.'});
        }
        res.status(200).json(updateMessage);
    } catch (error) {
        res.status(404).json({message: 'You won\'t believe.. Error updating the channel'});
        console.error('You won\'t believe.. Error updating the channel', error);
    }
   
}

  ///////////////
 //// DELETE ///
///////////////

export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const { messageId } = req.params;
        const deletedMessage = await Message.findByIdAndDelete(messageId);
        if(!deletedMessage) {
            return res.status(404).json({message: 'Houston, we have a problem! Message not found.'});
        }
        res.status(200).json({message: 'Message deleted. You won\'t see it again'});
    } catch (error) {
        console.error('Error deleting the message... Hmm, that\'s not good.', error);
        res.status(500).json({message: 'Error deleting the message... Hmm, that\'s not good my friend.'});
    }
}